import request from 'supertest';
import app from '../app.js';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';


describe('Email Controller', () => {
  let mockUser;
  let authToken;

  beforeAll(async () => {
    mockUser = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: `emailtest-${Date.now()}@mail.com`,
        password: 'senha123',
        emailVerified: false,
      },
    });

    authToken = jwt.sign({ id: mockUser.id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: 'emailtest-' } } });
    await prisma.$disconnect();
  });

  describe('POST /api/email/enviar-confirmacao-email', () => {
    it('deve enviar um e-mail de confirmação com sucesso', async () => {
      const res = await request(app)
        .post('/api/email/enviar-confirmacao-email')
        .set('Cookie', `token=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Email de confirmação enviado');
    });

    it('deve retornar erro se o email já estiver verificado', async () => {
      await prisma.user.update({
        where: { id: mockUser.id },
        data: { emailVerified: true },
      });

      const res = await request(app)
        .post('/api/email/enviar-confirmacao-email')
        .set('Cookie', `token=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Email já verificado');
    });
  });

  describe('GET /api/email/confirmar-email', () => {
    it('deve confirmar o e-mail com sucesso', async () => {
      await prisma.user.update({
        where: { id: mockUser.id },
        data: { emailVerified: false },
      });

      const token = jwt.sign(
        { id: mockUser.id },
        process.env.JWT_EMAIL_TOKEN,
        { expiresIn: process.env.JWT_EMAIL_EXPIRATION || '5m' }
      );

      const res = await request(app).get(`/api/email/confirmar-email?token=${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Email confirmado com sucesso');

      const user = await prisma.user.findUnique({ where: { id: mockUser.id } });
      expect(user.emailVerified).toBe(true);
    });

    it('deve retornar erro se o token for inválido', async () => {
      const res = await request(app).get('/api/email/confirmar-email?token=tokeninvalido');
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Erro ao confirmar e-mail');
    });

    it('deve retornar erro se o token não for fornecido', async () => {
      const res = await request(app).get('/api/email/confirmar-email');
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Token não encontrado');
    });
  });
});
