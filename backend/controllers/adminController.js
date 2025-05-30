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

export const getAllItems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const search = req.query.search || '';
    const orderBy = req.query.orderBy || 'createdAt';
    const orderDirection = req.query.orderDirection === 'asc' ? 'asc' : 'desc';
    
    try {
        const baseWhere = {
        AND: [
            {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ],
            },
        ],
        };
    
        const total = await prisma.learningItem.count({ where: baseWhere });
    
        const items = await prisma.learningItem.findMany({
        where: baseWhere,
        orderBy: { [orderBy]: orderDirection },
        skip: (page - 1) * pageSize,
        take: pageSize,
        });
    
        return res.json({ items, total, page, pageSize });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar itens públicos" });
    }
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
