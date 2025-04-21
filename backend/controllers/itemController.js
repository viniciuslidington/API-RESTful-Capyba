import prisma from "../lib/prisma.js";

export const listarItens = async (req, res) => {
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
            {
            NOT: { type: 'Projeto' },
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

export const listarItensPrivados = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const search = req.query.search || '';
    const orderBy = req.query.orderBy || 'createdAt';
    const orderDirection = req.query.orderDirection === 'asc' ? 'asc' : 'desc';
    
    try {
        const baseWhere = {
        AND: [
            { type: 'Projeto' },
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
        return res.status(500).json({ error: "Erro ao listar projetos" });
    }
};

