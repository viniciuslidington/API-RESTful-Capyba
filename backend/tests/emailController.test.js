/* eslint-disable no-undef */
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {jest} from '@jest/globals'

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

describe("Email Controller", () => {
  let authToken;
  let mockUser;

  beforeAll(async () => {
    // Cria um usuário de teste
    mockUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        emailVerified: false,
      },
    });

    authToken = jwt.sign({ id: mockUser.id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    // Limpa os dados de teste e desconecta o Prisma
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /email/enviar-confirmacao", () => {
    it("deve enviar um e-mail de confirmação com sucesso", async () => {
      const res = await request(app)
        .post("/api/email/enviar-confirmacao")
        .set("Cookie", `token=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Email de confirmação enviado");
      expect(nodemailer.createTransport).toHaveBeenCalled();
    });

    it("deve retornar erro se o usuário não for encontrado", async () => {
      const invalidToken = jwt.sign({ id: 9999 }, process.env.JWT_SECRET); // ID inexistente

      const res = await request(app)
        .post("/api/email/enviar-confirmacao")
        .set("Cookie", `token=${invalidToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Usuário não encontrado");
    });

    it("deve retornar erro se o e-mail já estiver verificado", async () => {
      // Atualiza o usuário para ter o e-mail verificado
      await prisma.user.update({
        where: { id: mockUser.id },
        data: { emailVerified: true },
      });

      const res = await request(app)
        .post("/api/email/enviar-confirmacao")
        .set("Cookie", `token=${authToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email já verificado");
    });
  });

  describe("GET /email/confirmar-email", () => {
    it("deve confirmar o e-mail com sucesso", async () => {
      const tokenemail = jwt.sign({ id: mockUser.id }, process.env.JWT_EMAIL_TOKEN, {
        expiresIn: process.env.JWT_EMAIL_EXPIRATION,
      });

      const res = await request(app).get(`/api/email/confirmar-email?token=${tokenemail}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Email confirmado com sucesso");

      const updatedUser = await prisma.user.findUnique({ where: { id: mockUser.id } });
      expect(updatedUser.emailVerified).toBe(true);
    });

    it("deve retornar erro se o token não for fornecido", async () => {
      const res = await request(app).get("/api/email/confirmar-email");

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Token não encontrado");
    });

    it("deve retornar erro se o token for inválido", async () => {
      const res = await request(app).get("/api/email/confirmar-email?token=invalidtoken");

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Erro ao confirmar e-mail");
    });
  });
});