import request from 'supertest';
import app from '../app.js';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('Endpoints de Interesse em LearningItem', () => {
  let user;
  let authToken;
  let item;

  beforeAll(async () => {
    // Cria usuário de teste
    user = await prisma.user.create({
      data: {
        name: 'Teste Interesse',
        email: `interesse-${Date.now()}@mail.com`,
        password: 'senha123',
      },
    });
    authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    // Cria item de aprendizado
    item = await prisma.learningItem.create({
      data: {
        title: 'Curso Jest',
        description: 'Aprenda testes automatizados',
        type: 'Curso'
      }
    });
  });

  afterAll(async () => {
    await prisma.userLearningItem.deleteMany({});
    await prisma.learningItem.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { contains: 'interesse-' } } });
    await prisma.$disconnect();
  });

  it('deve registrar interesse em um item', async () => {
    const res = await request(app)
      .post('/api/items/interesse')
      .set('Cookie', `token=${authToken}`)
      .send({ itemId: item.id });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Interesse registrado com sucesso.');
    expect(res.body.interesse).toHaveProperty('userId', user.id);
  });

  it('deve retornar erro ao registrar interesse duplicado', async () => {
    const res = await request(app)
      .post('/api/items/interesse')
      .set('Cookie', `token=${authToken}`)
      .send({ itemId: item.id });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Você já demonstrou interesse nesse item.');
  });

  it('deve listar os itens que o usuário demonstrou interesse', async () => {
    const res = await request(app)
      .get('/api/items/interesses')
      .set('Cookie', `token=${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.itens)).toBe(true);
    expect(res.body.itens[0]).toHaveProperty('title', 'Curso Jest');
  });

  it('deve remover o interesse do usuário', async () => {
    const res = await request(app)
      .delete('/api/items/interesse')
      .set('Cookie', `token=${authToken}`)
      .send({ itemId: item.id });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Interesse removido com sucesso.');
  });

  it('deve retornar erro ao remover interesse que não existe', async () => {
    const res = await request(app)
      .delete('/api/items/interesse')
      .set('Cookie', `token=${authToken}`)
      .send({ itemId: item.id });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Erro ao remover interesse.');
  });
});
