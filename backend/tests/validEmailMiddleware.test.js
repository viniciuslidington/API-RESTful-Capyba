import { validEmail } from '../middlewares/validemailMiddleware.js';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { jest } from '@jest/globals';

describe('Middleware - validEmail (com banco real)', () => {
  const testSecret = 'test-secret';
  let req, res, next;
  let userNaoVerificado, userVerificado;

  beforeAll(async () => {
    process.env.JWT_SECRET = testSecret;

    // Cria usuários reais no banco
    userNaoVerificado = await prisma.user.create({
      data: {
        name: 'Usuário Teste Não Verificado',
        email: `naoverificado-${Date.now()}@test.com`,
        password: '123456',
        emailVerified: false,
      },
    });

    userVerificado = await prisma.user.create({
      data: {
        name: 'Usuário Teste Verificado',
        email: `verificado-${Date.now()}@test.com`,
        password: '123456',
        emailVerified: true,
      },
    });
  });

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterAll(async () => {
    // Remove os usuários criados
    await prisma.user.deleteMany({
      where: {
        id: {
          in: [userNaoVerificado.id, userVerificado.id],
        },
      },
    });
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    await validEmail(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se o token for inválido', async () => {
    req.cookies.token = 'token-invalido';
    await validEmail(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido ou expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se o email não for verificado', async () => {
    const token = jwt.sign({ id: userNaoVerificado.id }, testSecret);
    req.cookies.token = token;

    await validEmail(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email não verificado. Para acessar a Lista Privativa e ter acesso aos Projetos Práticos, valide seu email.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() se o token for válido e email for verificado', async () => {
    const token = jwt.sign({ id: userVerificado.id }, testSecret);
    req.cookies.token = token;

    await validEmail(req, res, next);

    expect(req.userId).toBe(userVerificado.id);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
