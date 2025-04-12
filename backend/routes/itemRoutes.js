import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validEmail } from "../middlewares/validemailMiddleware.js";
import { listarItens, listarProjetos} from "../controllers/itemController.js";

const router = express.Router();

// Rota para listar itens
router.get("/getlist", verifyToken, listarItens);
router.get("/getprojects", validEmail, listarProjetos);


export default router;