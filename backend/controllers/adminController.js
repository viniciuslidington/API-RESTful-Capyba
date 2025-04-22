import prisma from "../lib/prisma.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        },
        });
    
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuários" });
    }
};


export const deleteUser = async (req, res) => {
    const { id } = req.body;

    try {
        await prisma.user.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar usuário" });
    };
};


export const addItem = async (req, res) => {
    const { title , description , type } = req.body;

    try {
        const newItem = await prisma.learningItem.create({
            data: {
                title,
                description,
                type
            }
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Erro ao adicionar item" });
    };
};


export const deleteItem = async (req, res) => {
    const { id } = req.body;

    try {
        await prisma.learningItem.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({ message: "Item deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar item" });
    };
};

