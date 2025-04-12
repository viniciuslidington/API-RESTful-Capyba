import prisma from "../lib/prisma.js";

export const listarItens = async (req, res) => {
  try {
    const itens = await prisma.LearningItem.findMany({
      where: {
        OR: [
          { type: "Curso" },
          { type: "Artigo" }
        ]
      }
    });
    res.status(200).json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar itens" });
  }
}

export const listarProjetos = async (req, res) => {
    try {
        const projetos = await prisma.LearningItem.findMany({
        where: {
            type: "Projeto"
        }
        });
        res.status(200).json(projetos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao listar projetos" });
    }
}