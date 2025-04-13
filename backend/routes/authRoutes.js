import express from "express";
import upload from "../config/multer.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { registerUser, loginUser, logoutUser, changePassword, getMe, editarUsuario} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyToken, logoutUser);
router.get("/me", verifyToken, getMe);
router.post("/password", verifyToken, changePassword)
router.put("/editaruser", verifyToken, upload.single("image"), editarUsuario);

export default router;
