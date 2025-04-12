import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const validEmail = async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // você poderá acessar em qualquer rota
    
        const user = await prisma.User.findUnique({
        where: {
            id: req.userId,
        },
        });
    
        if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
        }
    
        if (user.emailVerified) {
        next();
        } else {
        return res.status(403).json({ message: "Email não verificado. Para acessar a Lista Privativa e ter acesso aos Projetos Práticos, valide seu email." });
        }

    } catch (err) {
        return res.status(403).json({ message: "Token inválido ou expirado" });
    }
    }