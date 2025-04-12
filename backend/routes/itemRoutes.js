import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validEmail } from "../middlewares/validemailMiddleware.js";
import { listarItens } from "../controllers/itemController.js";
import { listarItensPrivados } from "../controllers/itemPrivadoController.js";


const router = express.Router();

// Rota para listar itens
router.get("/getlist", verifyToken, listarItens);
router.get("/getprojects", validEmail, listarItensPrivados);


export default router;