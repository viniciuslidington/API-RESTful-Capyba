import express from "express";
import upload from "../config/multer.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { registerUser, loginUser, logoutUser, changePassword, getUser, editarUsuario } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints relacionados à autenticação e gerenciamento de usuários
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagem de perfil do usuário (opcional)
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos ou e-mail já em uso
 *       500:
 *         description: Erro ao registrar usuário
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login de um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Campos não podem estar vazios
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro ao realizar login
 */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Realiza logout do usuário
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Retorna informações do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário retornadas com sucesso
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro ao buscar informações do usuário
 */

/**
 * @swagger
 * /api/auth/password:
 *   post:
 *     summary: Atualiza a senha do usuário
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Senha antiga do usuário
 *               newPassword:
 *                 type: string
 *                 description: Nova senha do usuário
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Senha antiga incorreta
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro ao alterar senha
 */

/**
 * @swagger
 * /api/auth/editaruser:
 *   put:
 *     summary: Edita informações do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do usuário
 *               email:
 *                 type: string
 *                 description: Novo e-mail do usuário
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem de perfil do usuário (opcional)
 *     responses:
 *       200:
 *         description: Informações atualizadas com sucesso
 *       400:
 *         description: E-mail já está em uso
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Token inválido ou expirado
 *       500:
 *         description: Erro ao atualizar informações do usuário
 */

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyToken, logoutUser);
router.get("/me", verifyToken, getUser);
router.post("/password", verifyToken, changePassword);
router.put("/editaruser", verifyToken, upload.single("image"), editarUsuario);

export default router;
