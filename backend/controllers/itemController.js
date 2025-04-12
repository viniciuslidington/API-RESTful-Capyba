import prisma from "..lib/prisma.js";

export const listarItens = async (req, res) => {
  try {
    const itens = await prisma.item.findMany();
    res.status(200).json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar itens" });
  }
}

