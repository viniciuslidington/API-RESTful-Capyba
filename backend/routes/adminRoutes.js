import { validAdmin } from "../middlewares/adminMiddleware.js";    
import express from "express";
import { getAllUsers, deleteUser, deleteItem, addItem } from "../controllers/adminController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints para administração do sistema
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retorna todos os usuários cadastrados
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   emailVerified:
 *                     type: boolean
 *                   image:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erro ao buscar usuários
 */

/**
 * @swagger
 * /api/admin/deleteuser:
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID do usuário a ser deletado
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       500:
 *         description: Erro ao deletar usuário
 */

/**
 * @swagger
 * /api/admin/items:
 *   post:
 *     summary: Adiciona um novo item de aprendizado
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do item
 *               description:
 *                 type: string
 *                 description: Descrição do item
 *               type:
 *                 type: string
 *                 description: "Tipo do item (ex: 'projeto', 'curso')"
 *     responses:
 *       201:
 *         description: Item adicionado com sucesso
 *       500:
 *         description: Erro ao adicionar item
 */

/**
 * @swagger
 * /api/admin/deleteitem:
 *   post:
 *     summary: Deleta um item de aprendizado pelo ID
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID do item a ser deletado
 *     responses:
 *       200:
 *         description: Item deletado com sucesso
 *       500:
 *         description: Erro ao deletar item
 */

router.get("/users", validAdmin, getAllUsers);
router.delete("/deleteuser", validAdmin, deleteUser);
router.post("/additem", validAdmin, addItem);
router.post("/deleteitem", validAdmin, deleteItem);

export default router;