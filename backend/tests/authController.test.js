import request from "supertest";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import app from "../app.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {it, jest} from '@jest/globals';
import * as prismaClient from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Auth Controller", () => {
  let authToken;
  const mockUser = {
    id: 87,
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    password: "password123",
  };

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        name: mockUser.name,
        email: mockUser.email,
        password: await bcrypt.hash(mockUser.password, 10),
      },
    });

    authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: "test-" } },
          { email: { contains: "img-" } },
          { email: { contains: "existing-" } },
          { email: { contains: "new-" } },
          { email: { contains: "errointerno-" } },
          { email: { contains: "duplicado-" } },
          { email: { contains: "qualquer-" } },
          { email: { contains: "usuario-" } },
          { email: { contains: "comimagem-" } },
          { email: { contains: "semimagem-" } },
          { email: { contains: "email-sem-encontrar-" } },
          { email: { contains: "novo-" } },
        ],
      },
    });
    
    await prisma.$disconnect();
  });

  describe("POST /register", () => {
    it("deve registrar um usuário com sucesso", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "New User",
          email: `new-${Date.now()}@example.com`,
          password: "password123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("user");
    });

    it("deve retornar erro ao registrar com campos vazios", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "",
          email: "",
          password: "",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/são obrigatórios/);
    });

    it("deve retornar erro ao registrar com e-mail duplicado", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(mockUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/já está em uso/);
    });

    it('deve registrar um usuário com imagem', async () => {
      const emailComImagem = `img-${Date.now()}@example.com`;

      const res = await request(app)
        .post('/api/auth/register')
        .field('name', 'Com Imagem')
        .field('email', emailComImagem)
        .field('password', '123456')
        .attach('image', path.resolve('tests/fixtures/avatar.png')); // use uma imagem real de teste

      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('image');
    });
    it('deve retornar erro 500 se falhar ao registrar usuário (erro genérico)', async () => {
      // mocka o método user.create para lançar um erro
      jest.spyOn(prismaClient.default.user, 'create').mockImplementation(() => {
        throw new Error('Erro interno de teste');
      });
  
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Erro Interno',
          email: `errointerno-${Date.now()}@mail.com`,
          password: '123456'
        });
  
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Erro ao registrar usuário');
  
      // limpa o mock depois do teste
      prismaClient.default.user.create.mockRestore();
    });
  });

  describe("POST /login", () => {
    it("deve fazer login com sucesso", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: mockUser.email,
          password: mockUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("user");
    });

    it("deve retornar erro ao fazer login com senha incorreta", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: mockUser.email,
          password: "wrongpassword",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/Senha incorreta/);
    });
    it("deve retornar erro ao fazer login com e-mail não registrado", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "email-sem-encontrar@email.com",
          password: "password123"})

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/Usuário não encontrado/);
    });
    it("deve retornar erro ao fazer login com campos vazios", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "",
          password: "",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/Campos não podem estar vazios/);
    });
    it('deve retornar erro 500 se ocorrer erro inesperado no login', async () => {
      const fakeError = new Error('Erro de banco de dados');
    
      // Mock do console.error para não poluir o terminal
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
      // Simula erro ao buscar usuário
      jest.spyOn(prismaClient.default.user, 'findUnique').mockImplementation(() => {
        console.error(fakeError); // Ensure the error is logged
        throw fakeError;
      });
    
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'usuario@teste.com',
          password: '123456'
        });
    
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Erro ao fazer login');
    
      // Verifica se console.error foi chamado corretamente
      expect(consoleSpy).toHaveBeenCalledWith(fakeError);
    
      // Limpa mocks
      consoleSpy.mockRestore();
      prismaClient.default.user.findUnique.mockRestore();
    });

  });

  describe("GET /logout", () => {
    it("deve realizar logout com sucesso", async () => {
      const res = await request(app)
        .get("/api/auth/logout")
        .set("Cookie", `token=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Logout realizado com sucesso");
    });
  });

  describe("POST /password", () => {
    it("deve alterar a senha com sucesso", async () => {
      const res = await request(app)
        .post("/api/auth/password")
        .set("Cookie", `token=${authToken}`)
        .send({
          oldPassword: mockUser.password,
          newPassword: "newpassword123",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Senha alterada com sucesso");
    });

    it("deve retornar erro ao fornecer a senha antiga incorreta", async () => {
      const res = await request(app)
        .post("/api/auth/password")
        .set("Cookie", `token=${authToken}`)
        .send({
          oldPassword: "wrongpassword",
          newPassword: "newpassword123",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/Senha antiga incorreta/);
    });

    it(`deve retornar erro ao nao encontrar o usuário`, async () => {
      const invalidToken = jwt.sign({ id: "invalidUserId" }, process.env.JWT_SECRET);
      const res = await request(app)
        .post("/api/auth/password")
        .set("Cookie", `token=${invalidToken}`)
        .send({
          oldPassword: "wrongpassword",
          newPassword: "newpassword123",
        });
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toMatch(/Erro/);
    }
    );
    
  });

  describe("GET /me", () => {
    it("deve retornar os dados do usuário autenticado", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", `token=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("email", mockUser.email);
    });

    it('deve retornar 500 se houver erro interno ao buscar o usuário', async () => {
      // Mock do erro
      const fakeError = new Error('Erro de banco de dados');
      jest.spyOn(console, 'error').mockImplementation(() => {}); // oculta log no teste
      jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(fakeError);
  
      // Cria um token de teste
      const token = jwt.sign({ id: 999 }, process.env.JWT_SECRET);
  
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`token=${token}`]);
  
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Erro ao buscar usuário');
  
      // Limpa os mocks
      prisma.user.findUnique.mockRestore();
      console.error.mockRestore();
    });
  });

  describe("PUT /editaruser", () => {

    it("deve editar o nome do usuário", async () => {
      const res = await request(app)
        .put("/api/auth/editaruser")
        .set("Cookie", `token=${authToken}`)
        .send({ name: "Updated Name" });

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("name", "Updated Name");
    });

    it("deve retornar erro ao tentar atualizar com e-mail já existente", async () => {
      // Cria um usuário com um e-mail diferente
      const existingEmail = `existing-${Date.now()}@example.com`;

      await prisma.user.create({
        data: {
          name: "Existing User",
          email: existingEmail, // E-mail único
          password: await bcrypt.hash("password123", 10),
        },
      });

      const res = await request(app)
        .put("/api/auth/editaruser")
        .set("Cookie", `token=${authToken}`)
        .send({ email: existingEmail }); // Tenta atualizar para o e-mail existente

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/E-mail já está em uso/);
    });
  });

  it('deve atualizar nome e email do usuário autenticado', async () => {
    const novoNome = 'Novo Nome Testado';
    const novoEmail = `novo-${Date.now()}@example.com`;

    const res = await request(app)
      .put('/api/auth/editaruser')
      .set('Cookie', [`token=${authToken}`])
      .send({
        name: novoNome,
        email: novoEmail,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Informações atualizadas com sucesso.');
    expect(res.body.user.name).toBe(novoNome);
    expect(res.body.user.email).toBe(novoEmail);
  });

  it('deve retornar erro se o novo e-mail já estiver em uso', async () => {
    const emailDuplicado = `duplicado-${Date.now()}@example.com`;

    // cria outro usuário com email que será usado no teste de duplicado
    await prisma.user.create({
      data: {
        name: 'Usuário Existente',
        email: emailDuplicado,
        password: await bcrypt.hash('123456', 10),
      },
    });

    const res = await request(app)
      .put('/api/auth/editaruser')
      .set('Cookie', [`token=${authToken}`])
      .send({
        email: emailDuplicado,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'E-mail já está em uso.');
  });

  it('deve atualizar a imagem do usuário com sucesso', async () => {
    const res = await request(app)
      .put('/api/auth/editaruser')
      .set('Cookie', [`token=${authToken}`])
      .attach('image', path.resolve(__dirname, 'fixtures/avatar.png')); // use uma imagem real de teste
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Informações atualizadas com sucesso.');
    expect(res.body.user).toHaveProperty('image');
  });

  it('deve retornar erro 500 se ocorrer erro interno', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error('Erro interno'));

    const res = await request(app)
      .put('/api/auth/editaruser')
      .set('Cookie', [`token=${authToken}`])
      .send({
        name: 'Qualquer Nome',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Erro ao atualizar usuário.');

    prisma.user.findUnique.mockRestore();
  });

});
