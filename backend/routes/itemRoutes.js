import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validEmail } from "../middlewares/validemailMiddleware.js";
import { listarItens, listarItensPrivados } from "../controllers/itemController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Itens
 *   description: Endpoints relacionados à listagem de itens de aprendizado
 */

/**
 * @swagger
 * /api/items/getlist:
 *   get:
 *     summary: Lista itens públicos de aprendizado
 *     tags: [Itens]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página atual
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Tamanho da página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Campo de ordenação
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Lista de itens públicos retornada com sucesso
 *       500:
 *         description: Erro ao buscar os itens
 */

/**
 * @swagger
 * /api/items/getprojects:
 *   get:
 *     summary: Lista itens do tipo "Projeto" (privados, apenas para e-mails verificados)
 *     tags: [Itens]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página atual
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Tamanho da página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Campo de ordenação
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Lista de projetos retornada com sucesso
 *       403:
 *         description: Acesso negado. E-mail não verificado.
 *       500:
 *         description: Erro ao buscar os projetos
 */

router.get("/getlist", verifyToken, listarItens);
router.get("/getprojects", validEmail, listarItensPrivados);

export default router;