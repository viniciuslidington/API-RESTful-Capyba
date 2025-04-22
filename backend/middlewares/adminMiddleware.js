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
    
        const user = await prisma.User.findUnique({
        where: {
            id: req.userId,
        },
        });
    
        if (user.email) {
            contains = user.email.includes("admin@capyba");
        next();
        } else {
        return res.status(403).json({ message: "Usuário não possui acesso administrativo" });
        }

    } catch (err) {
        return res.status(403).json({ message: "Token inválido ou expirado" });
    }
}