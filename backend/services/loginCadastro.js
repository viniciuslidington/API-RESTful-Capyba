import express from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt"; // Importa o bcrypt
dotenv.config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // Permite ler JSON no corpo das requisições
app.use(cookieParser());

// Rota para cadastro (exemplo de como salvar a senha encriptada)
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body; // Inclui o campo 'name'

    try {
        // Gera o hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Salva o usuário no banco de dados com o nome, email e senha encriptada
        const user = await prisma.user.create({
            data: {
                name: name, // Adiciona o campo 'name'
                email: email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "Usuário registrado com sucesso", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao registrar usuário" });
    }
});

// Rota de login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Verifica se o usuário existe no banco de dados
    prisma.user.findUnique({
        where: {
            email: email,
        },
    })
        .then(async (user) => {
            if (!user) {
                return res.status(401).json({ message: "Usuário não encontrado" });
            }

            // Verifica se a senha está correta
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Senha incorreta" });
            }

            // Cria um token JWT
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Use cookies seguros em produção
                sameSite: "Strict",
            });
            // Retorna o token para o cliente
            res.json({ message: "Usuário registrado com sucesso", user });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Erro ao fazer login" });
        });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
}
);