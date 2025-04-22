import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const validAdmin = async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
    
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
        });
    
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const isAdmin = user.email && user.email.includes("admin@capyba");

        if (isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "Usuário não possui acesso administrativo" });
        }

    } catch (err) {
        return res.status(403).json({ message: "Token inválido ou expirado" });
    }
};