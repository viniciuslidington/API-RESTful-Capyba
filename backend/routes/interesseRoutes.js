import express from "express";
import { marcarInteresse, removerInteresse, listarInteressesDoUsuario } from "../controllers/interesseController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Interesses
 *   description: Endpoints relacionados ao gerenciamento de interesses dos usuários
 */

/**
 * @swagger
 * /api/interesse/interesse:
 *   post:
 *     summary: Marca interesse de um usuário em um item
 *     tags: [Interesses]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: integer
 *                 description: ID do item de aprendizado
 *     responses:
 *       201:
 *         description: Interesse registrado com sucesso
 *       400:
 *         description: ID do item ausente ou interesse já existente
 *       404:
 *         description: Item não encontrado
 *       500:
 *         description: Erro ao registrar interesse
 */

/**
 * @swagger
 * /api/interesse/interesse:
 *   delete:
 *     summary: Remove o interesse de um usuário em um item
 *     tags: [Interesses]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: integer
 *                 description: ID do item de aprendizado
 *     responses:
 *       200:
 *         description: Interesse removido com sucesso
 *       400:
 *         description: ID do item ausente
 *       500:
 *         description: Erro ao remover interesse
 */

/**
 * @swagger
 * /api/interesse/interesses:
 *   get:
 *     summary: Lista os itens marcados com interesse pelo usuário logado
 *     tags: [Interesses]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de interesses retornada com sucesso
 *       500:
 *         description: Erro ao buscar itens de interesse
 */

router.post('/interesse', verifyToken, marcarInteresse);
router.delete('/interesse', verifyToken, removerInteresse);
router.get('/interesses', verifyToken, listarInteressesDoUsuario);

export default router;