import prisma from "../lib/prisma.js";

export const marcarInteresse = async (req, res) => {
    const userId = req.userId;
    const { itemId } = req.body;
  
    if (!itemId) {
      return res.status(400).json({ message: "ID do item é obrigatório." });
    }
  
    try {
      // Verifica se o item existe
      const item = await prisma.learningItem.findUnique({
        where: { id: itemId },
      });
  
      if (!item) {
        return res.status(404).json({ message: "Item não encontrado." });
      }
  
      // Verifica se já existe interesse
      const interesseExistente = await prisma.userLearningItem.findUnique({
        where: {
          userId_learningItemId: {
            userId,
            learningItemId: itemId
          }
        }
      });
  
      if (interesseExistente) {
        return res.status(400).json({ message: "Você já demonstrou interesse nesse item." });
      }
  
      // Cria o vínculo
      const interesse = await prisma.userLearningItem.create({
        data: {
          userId,
          learningItemId: itemId,
        },
      });
  
      return res.status(201).json({
        message: "Interesse registrado com sucesso.",
        interesse,
      });
  
    } catch (err) {
      console.error("Erro ao marcar interesse:", err);
      return res.status(500).json({ message: "Erro ao registrar interesse." });
    }
};
  
export const removerInteresse = async (req, res) => {
    const userId = req.userId;
    const { itemId } = req.body;
  
    if (!itemId) {
      return res.status(400).json({ message: "ID do item é obrigatório." });
    }
  
    try {
      await prisma.userLearningItem.delete({
        where: { userId_learningItemId: { userId, learningItemId: itemId } },
      });
  
      return res.status(200).json({ message: "Interesse removido com sucesso." });
    } catch (err) {
      console.error("Erro ao remover interesse:", err);
      return res.status(500).json({ message: "Erro ao remover interesse." });
    }
};

export const listarInteressesDoUsuario = async (req, res) => {
    const userId = req.userId;
  
    try {
      const interesses = await prisma.userLearningItem.findMany({
        where: { userId },
        include: { learningItem: true },
      });
  
      const itens = interesses.map(i => i.learningItem);
  
      return res.json({ itens });
    } catch (err) {
      console.error("Erro ao listar interesses:", err);
      return res.status(500).json({ message: "Erro ao buscar itens de interesse." });
    }
  };
  