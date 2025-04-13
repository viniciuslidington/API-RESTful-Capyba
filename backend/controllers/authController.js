import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios" });
  }

  if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
    return res.status(400).json({ error: "Campos não podem estar vazios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image,
      },
    });

    res.status(201).json({ message: "Usuário registrado com sucesso", user });
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(400).json({ error: "Este e-mail já está em uso" });
    }else {
      console.error(error);
      res.status(500).json({ message: "Erro ao registrar usuário" });
    }
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ message: "Login realizado com sucesso", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout realizado com sucesso" });
};


export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha antiga incorreta" });
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedNewPassword },
    });
    
    res.json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao alterar senha" });
  }
};

export const getMe = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true,
          interests: true
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
};

export const editarUsuario = async (req, res) => {
  const userId = req.userId; // vem do middleware de autenticação
  const { name, email } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const dataParaAtualizar = {};

    if (name) dataParaAtualizar.name = name;
    if (image) {
      dataParaAtualizar.image = req.file.path || `/uploads/${req.file.filename}`;
    }

    if (email && email !== user.email) {
      // Verifica se já existe esse novo e-mail
      const emailExistente = await prisma.user.findUnique({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ message: 'E-mail já está em uso.' });
      }
      dataParaAtualizar.email = email;
      dataParaAtualizar.emailVerified = false; // desverifica o novo e-mail
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id: userId },
      data: dataParaAtualizar,
    });

    return res.json({
      message: 'Informações atualizadas com sucesso.',
      user: usuarioAtualizado,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
};