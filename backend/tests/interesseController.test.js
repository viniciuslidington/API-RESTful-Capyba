import request from 'supertest';
import app from '../app.js';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import jest from 'jest-mock';

describe(`Interesse Controller testes`, () => {
    let mockUser;
    let mockItem;
    let mockItem2;
    let authToken;
    
    beforeAll(async () => {
        // Cria usuário de teste
        mockUser = await prisma.user.create({
            data: {
                name: 'Usuário Teste',
                email: `emailtest-${Date.now()}@mail.com`,
                password: 'senha123',
                emailVerified: true,
            },
        });
    
        // Cria itens de aprendizado para teste com o campo type obrigatório
        mockItem = await prisma.learningItem.create({
            data: {
                title: 'Item de Teste 1',
                description: 'Descrição do item 1',
                type: 'VIDEO', // Adicionando o campo type obrigatório
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()

            }
        });

        mockItem2 = await prisma.learningItem.create({
            data: {
                title: 'Item de Teste 2',
                description: 'Descrição do item 2',
                type: 'ARTICLE', // Adicionando o campo type obrigatório
                public: true,
                createdAt: new Date(),
                updatedAt: new Date()                
            }
        });

        authToken = jwt.sign({ id: mockUser.id }, process.env.JWT_SECRET);
    });

    afterAll(async () => {
        // Limpa todos os dados de teste
        await prisma.userLearningItem.deleteMany({ 
            where: { 
                OR: [
                    { userId: mockUser.id },
                    { learningItemId: { in: [mockItem.id, mockItem2.id] } }
                ]
            } 
        });
        
        await prisma.learningItem.deleteMany({ 
            where: { id: { in: [mockItem.id, mockItem2.id] } }
        });
        
        await prisma.user.delete({ where: { id: mockUser.id } });
        await prisma.$disconnect();
    });
    
    describe('POST /api/interesse/interesse - Marcar interesse', () => {
        it('deve retornar 400 se o itemId não for fornecido', async () => {
            const response = await request(app)
                .post('/api/interesse/interesse')
                .set('Cookie', `token=${authToken}`)
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("ID do item é obrigatório.");
        });

        it('deve retornar 401 se não houver token', async () => {
            const response = await request(app)
                .post('/api/interesse/interesse')
                .send({ itemId: mockItem.id });
            
            expect(response.status).toBe(401);
        });

        it('deve marcar interesse com sucesso', async () => {
            const response = await request(app)
                .post('/api/interesse/interesse')
                .set('Cookie', `token=${authToken}`)
                .send({ itemId: mockItem.id });
            
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Interesse registrado com sucesso.");
        });

        it('deve retornar 404 se o item não existir', async () => {
            const response = await request(app)
                .post('/api/interesse/interesse')
                .set('Cookie', `token=${authToken}`)
                .send({ itemId: 999999 });
            
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Item não encontrado.");
        });

        it('deve retornar 400 quando usuário já tem interesse no item', async () => {
            // Cria o interesse uma vez
            await request(app)
                .post('/api/interesse/interesse')
                .set('Cookie', `token=${authToken}`)
                .send({ itemId: mockItem.id });

            // Tenta criar o mesmo interesse novamente
            const response = await request(app)
                .post('/api/interesse/interesse')
                .set('Cookie', `token=${authToken}`)
                .send({ itemId: mockItem.id });
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Você já demonstrou interesse nesse item.");
        });


        it('deve retornar 500 e não criar registro em caso de erro', async () => {
            await prisma.userLearningItem.deleteMany({
                where: {
                  userId: mockUser.id,
                  learningItemId: mockItem.id,
                },
              });
              
            jest.spyOn(prisma.userLearningItem, 'create').mockRejectedValueOnce(new Error('DB Error'));

            const response = await request(app)
                .post('/api/interesse/interesse')
                .set('Cookie', `token=${authToken}`)
                .send({ itemId: mockItem2.id });
            
            expect(response.status).toBe(500);
            
            const interesses = await prisma.userLearningItem.count({
                where: {
                    userId: mockUser.id,
                    learningItemId: mockItem.id 
                }
            });
            expect(interesses).toBe(0);
        });
    });

    describe('DELETE /api/interesse/interesse - Remover interesse', () => {
        beforeEach(async () => {
            // Primeiro remove qualquer interesse existente
            await prisma.userLearningItem.deleteMany({
                where: {
                    userId: mockUser.id,
                    learningItemId: mockItem.id
                }
            });
            
            // Depois cria o interesse de teste
            await prisma.userLearningItem.create({
                data: {
                    userId: mockUser.id,
                    learningItemId: mockItem.id,
                },
            });
        });
    
        it('deve retornar 200 e remover o interesse', async () => {
            // Verifica se o interesse existe antes da remoção
            const interesseAntes = await prisma.userLearningItem.findUnique({
                where: {
                    userId_learningItemId: {
                        userId: mockUser.id,
                        learningItemId: mockItem.id
                    }
                }
            });
            expect(interesseAntes).not.toBeNull();
    
            const response = await request(app)
                .delete('/api/interesse/interesse')
                .set('Cookie', `token=${authToken}`)
                .send({ itemId: mockItem.id });
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Interesse removido com sucesso.");
    
            // Verifica se o interesse foi removido
            const interesseDepois = await prisma.userLearningItem.findUnique({
                where: {
                    userId_learningItemId: {
                        userId: mockUser.id,
                        learningItemId: mockItem.id
                    }
                }
            });
            expect(interesseDepois).toBeNull();
        });

        it('deve retornar 400 se o itemId não for fornecido', async () => {
            const response = await request(app)
                .delete('/api/interesse/interesse')
                .set('Cookie', `token=${authToken}`)
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("ID do item é obrigatório.");
        }
        );

        it('deve retornar 500 ao falhar na remoção do interesse', async () => {
            // Garante que existe o interesse para tentar deletar
            await prisma.userLearningItem.deleteMany({
                where: {
                    userId: mockUser.id,
                    learningItemId: mockItem.id
                }
            });

            await prisma.userLearningItem.create({
              data: {
                userId: mockUser.id,
                learningItemId: mockItem.id,
              },
            });
          
            // Simula erro no banco
            jest
              .spyOn(prisma.userLearningItem, 'delete')
              .mockRejectedValueOnce(new Error('Erro simulado'));
          
            const response = await request(app)
              .delete('/api/interesse/interesse')
              .set('Cookie', `token=${authToken}`)
              .send({ itemId: mockItem.id });
          
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Erro ao remover interesse.');
          });

    });

    describe('GET /api/interesse/interesses - Listar interesses', () => {
        beforeEach(async () => {
            // Limpa interesses anteriores e cria novos para teste
            await prisma.userLearningItem.deleteMany({ where: { userId: mockUser.id } });
            
            await prisma.userLearningItem.createMany({
                data: [
                    { userId: mockUser.id, learningItemId: mockItem.id },
                    { userId: mockUser.id, learningItemId: mockItem2.id }
                ]
            });
        });

        it('deve retornar a lista de itens de interesse do usuário', async () => {
            const response = await request(app)
                .get('/api/interesse/interesses')
                .set('Cookie', `token=${authToken}`);
            
            expect(response.status).toBe(200);
            expect(response.body.itens).toHaveLength(2);
        });

        it('deve retornar 500 ao falhar na listagem de interesses', async () => {
            jest
                .spyOn(prisma.userLearningItem, 'findMany')
                .mockRejectedValueOnce(new Error('Erro simulado'));
        
            const response = await request(app)
                .get('/api/interesse/interesses')
                .set('Cookie', `token=${authToken}`);
        
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Erro ao buscar itens de interesse.');
        });

    });
});