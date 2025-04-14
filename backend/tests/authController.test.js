import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import path from 'path';
import bcrypt from "bcrypt";

describe("Auth Controller", () => {
  let authToken;
  const mockUser = {
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
    await prisma.user.deleteMany();
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

    it("deve retornar erro ao registrar com e-mail duplicado", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(mockUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/já está em uso/);
    });

    it('deve registrar um usuário com imagem', async () => {
      const emailComImagem = `img-${Date.now()}@mail.com`;

      const res = await request(app)
        .post('/api/auth/register')
        .field('name', 'Com Imagem')
        .field('email', emailComImagem)
        .field('password', '123456')
        .attach('image', path.resolve('tests/fixtures/avatar.png')); // use uma imagem real de teste

      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('image');
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
  });

  describe("GET /me", () => {
    it("deve retornar os dados do usuário autenticado", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", `token=${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("email", mockUser.email);
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
});
