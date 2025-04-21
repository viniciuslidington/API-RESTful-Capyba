// tests/authMiddleware.test.js
import { verifyToken } from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

describe('Middleware - verifyToken', () => {
  const mockNext = jest.fn();
  const mockUserId = 'user123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 se nenhum token for fornecido', () => {
    const req = { cookies: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    verifyToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se o token for inválido', () => {
    const req = { cookies: { token: 'token-invalido' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    verifyToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido ou expirado' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve chamar next() e adicionar userId ao req se o token for válido', () => {
    // Define a secret manualmente
    process.env.JWT_SECRET = 'test-secret';
  
    const token = jwt.sign({ id: mockUserId }, process.env.JWT_SECRET);
    const req = { cookies: { token } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    verifyToken(req, res, mockNext);
  
    expect(req.userId).toBe(mockUserId); // Agora vai funcionar
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled(); // não deve retornar erro
  });
  
});
