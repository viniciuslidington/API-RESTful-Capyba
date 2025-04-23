import request from 'supertest';
import app from '../app.js';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('Admin Controller + Middleware', () => {
  let adminUser, normalUser, authTokenAdmin, authTokenUser, item;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';

    // Cria usuário administrador
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: `admin@capyba-${Date.now()}.com`,
        password: 'adminpass',
        emailVerified: true,
      },
    });

    // Cria usuário comum
    normalUser = await prisma.user.create({
      data: {
        name: 'Usuário',
        email: `user-${Date.now()}@example.com`,
        password: 'userpass',
        emailVerified: true,
      },
    });

    // Gera tokens
    authTokenAdmin = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET);
    authTokenUser = jwt.sign({ id: normalUser.id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    // Limpa tudo
    await prisma.learningItem.deleteMany({
      where: {
        OR: [
          { title: 'Item Delete' },
          { title: 'Item Teste' },
          { title: 'Deletar' },
        ],
      },
    });
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: 'user-' } },
          { email: { contains: 'admin@capyba-' } },
          { email: { contains: '@example.com' } },
        ],
      },
    });
  });

  describe('Middleware - validAdmin', () => {
    it('deve negar acesso se token não fornecido', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.status).toBe(401);
    });

    it('deve negar acesso a usuário não admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Cookie', `token=${authTokenUser}`);
      expect(res.status).toBe(403);
    });

    it('deve permitir acesso ao admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Cookie', `token=${authTokenAdmin}`);
      expect(res.status).toBe(200);
    });

    it('deve retornar erro 500 ao buscar usuários (simulação)', async () => {
      jest.spyOn(prisma.user, 'findMany').mockRejectedValue(new Error('Erro simulado'));
      const res = await request(app)
        .get('/api/admin/users')
        .set('Cookie', `token=${authTokenAdmin}`);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro ao buscar usuários');
      prisma.user.findMany.mockRestore();
    });
  });

  describe('Admin Controller Endpoints', () => {
    it('deve adicionar um item com sucesso', async () => {
      const res = await request(app)
        .post('/api/admin/additem')
        .send({ title: 'Item Teste', description: 'Descrição', type: 'Curso' })
        .set('Cookie', `token=${authTokenAdmin}`);
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Item Teste');
      item = res.body;
    });

    it('deve retornar erro 500 ao adicionar item (simulação)', async () => {
      jest.spyOn(prisma.learningItem, 'create').mockRejectedValue(new Error('Erro simulado'));
      const res = await request(app)
        .post('/api/admin/additem')
        .send({ title: 'Item Teste', description: 'Descrição', type: 'Curso' })
        .set('Cookie', `token=${authTokenAdmin}`);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro ao adicionar item');
      prisma.learningItem.create.mockRestore();
    });

    it('deve deletar um item com sucesso', async () => {
      const itemToDelete = await prisma.learningItem.create({
        data: {
          title: 'Item Delete',
          description: 'Descrição',
          type: 'Curso',
        },
      });

      const res = await request(app)
        .post('/api/admin/deleteitem')
        .send({ id: itemToDelete.id })
        .set('Cookie', `token=${authTokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Item deletado com sucesso/);
    });

    it('deve retornar erro 500 ao deletar item (simulação)', async () => {
      jest.spyOn(prisma.learningItem, 'delete').mockRejectedValue(new Error('Erro simulado'));
      const res = await request(app)
        .post('/api/admin/deleteitem')
        .send({ id: 999 }) // ID inexistente
        .set('Cookie', `token=${authTokenAdmin}`);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro ao deletar item');
      prisma.learningItem.delete.mockRestore();
    });

    it('deve deletar um usuário com sucesso', async () => {
      const newUser = await prisma.user.create({
        data: {
          name: 'Temp User',
          email: `temp-${Date.now()}@example.com`,
          password: 'temp',
        },
      });

      const res = await request(app)
        .delete('/api/admin/deleteuser')
        .send({ id: newUser.id })
        .set('Cookie', `token=${authTokenAdmin}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Usuário deletado com sucesso/);
    });

    it('deve retornar erro 500 ao deletar usuário (simulação)', async () => {
      jest.spyOn(prisma.user, 'delete').mockRejectedValue(new Error('Erro simulado'));
      const res = await request(app)
        .delete('/api/admin/deleteuser')
        .send({ id: 999 }) // ID inexistente
        .set('Cookie', `token=${authTokenAdmin}`);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro ao deletar usuário');
      prisma.user.delete.mockRestore();
    });
  });
});
