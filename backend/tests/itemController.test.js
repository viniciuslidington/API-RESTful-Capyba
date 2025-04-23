import request from 'supertest';
import app from '../app.js';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('Item Controller - Listagens', () => {
    let mockUser;
    let mockUserEmail;
    let mockItems = [];
    let authToken;
    let verifiedAuthToken;

    beforeAll(async () => {
        // Cria usuários
        mockUser = await prisma.user.create({
            data: {
                name: 'Usuário Teste',
                email: `testuser-${Date.now()}@example.com`,
                password: 'password123',
                emailVerified: false,
            },
        });

        mockUserEmail = await prisma.user.create({
            data: {
                name: 'Usuário Teste Verificado',
                email: `testuser2-${Date.now()}@example.com`,
                password: 'password123',
                emailVerified: true,
            },
        });

        // Cria 3 itens: 2 não-projetos, 1 projeto
        mockItems = await Promise.all([
            prisma.learningItem.create({
                data: {
                    title: 'Artigo Público 1',
                    description: 'Conteúdo de artigo público',
                    type: 'Artigo',
                    public: true,
                },
            }),
            prisma.learningItem.create({
                data: {
                    title: 'Curso Público 2',
                    description: 'Conteúdo de curso público',
                    type: 'Curso',
                    public: true,
                },
            }),
            prisma.learningItem.create({
                data: {
                    title: 'Projeto Privado 1',
                    description: 'Conteúdo de projeto',
                    type: 'Projeto',
                    public: true,
                },
            }),
        ]);

        authToken = jwt.sign({ id: mockUser.id }, process.env.JWT_SECRET);
        verifiedAuthToken = jwt.sign({ id: mockUserEmail.id }, process.env.JWT_SECRET);
    });

    afterAll(async () => {
      // Deleta os itens criados no teste
      await prisma.learningItem.deleteMany({
          where: {
              id: {
                  in: mockItems.map(item => item.id),
              },
          },
      });
  
      // Deleta os usuários de teste
      await prisma.user.deleteMany({
          where: {
              id: {
                  in: [mockUser.id, mockUserEmail.id],
              },
          },
      });
  
      // Encerra a conexão com o banco
      await prisma.$disconnect();
  });
  

    describe('GET /api/getlist - Itens Públicos', () => {
        it('deve retornar itens públicos não-Projetos com status 200', async () => {
            const response = await request(app)
                .get('/api/items/getlist')
                .set('Cookie', `token=${authToken}`);

            expect(response.status).toBe(200);
        });

        it('deve retornar erro 500 em falha no banco', async () => {
            jest.spyOn(prisma.learningItem, 'findMany').mockRejectedValueOnce(new Error('DB error'));

            const response = await request(app)
                .get('/api/items/getlist')
                .set('Cookie', `token=${authToken}`);

            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/getprojects - Projetos (acesso apenas com email verificado)', () => {
        it('deve retornar itens do tipo Projeto se email verificado', async () => {
            const response = await request(app)
                .get('/api/items/getprojects')
                .set('Cookie', `token=${verifiedAuthToken}`);
            
            expect(response.status).toBe(200);
        });

        it('deve retornar erro 500 em falha no banco', async () => {
            jest.spyOn(prisma.learningItem, 'findMany').mockRejectedValueOnce(new Error('DB error'));

            const response = await request(app)
                .get('/api/items/getprojects')
                .set('Cookie', `token=${verifiedAuthToken}`);
            
            expect(response.status).toBe(500);
        });
    });
});
