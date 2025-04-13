import express from 'express';
import { enviarConfirmacaoEmail, confirmarEmail } from '../controllers/emailController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.post('/enviar-confirmacao-email', verifyToken, enviarConfirmacaoEmail);
router.get('/confirmar-email', confirmarEmail);

export default router;
