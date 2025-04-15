import express from "express";
import { marcarInteresse,removerInteresse, listarInteressesDoUsuario } from "../controllers/interesseController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para listar interesses
router.post('/interesse', verifyToken, marcarInteresse);
router.delete('/interesse', verifyToken, removerInteresse);
router.get('/interesses', verifyToken, listarInteressesDoUsuario);

export default router;