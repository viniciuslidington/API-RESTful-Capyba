import express from 'express';
import { enviarConfirmacaoEmail, confirmarEmail } from '../controllers/emailController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Endpoints relacionados ao envio e confirmação de e-mails
 */

/**
 * @swagger
 * /api/email/enviar-confirmacao-email:
 *   post:
 *     summary: Envia um e-mail de confirmação para o usuário autenticado
 *     tags: [Email]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: E-mail de confirmação enviado com sucesso
 *       500:
 *         description: Erro ao enviar o e-mail de confirmação
 */

/**
 * @swagger
 * /api/email/confirmar-email:
 *   get:
 *     summary: Confirma o e-mail do usuário com base no token fornecido
 *     tags: [Email]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de confirmação de e-mail
 *     responses:
 *       200:
 *         description: E-mail confirmado com sucesso
 *       400:
 *         description: Token não encontrado
 *       500:
 *         description: Erro ao confirmar o e-mail
 */

router.post('/enviar-confirmacao-email', verifyToken, enviarConfirmacaoEmail);
router.get('/confirmar-email', confirmarEmail);

export default router;
