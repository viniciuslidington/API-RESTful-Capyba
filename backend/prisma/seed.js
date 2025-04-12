import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const items = [
    // Cursos
    {
      title: "Curso de React com Vite",
      description: "Aprenda a construir aplicações modernas com React e Vite do zero.",
      type: "Curso",
    },
    {
      title: "Node.js para APIs REST",
      description: "Construa APIs eficientes usando Node.js e Express.",
      type: "Curso",
    },
    {
      title: "UX Design para Devs",
      description: "Entenda os fundamentos de UX aplicados ao desenvolvimento de produtos digitais.",
      type: "Curso"
    },
    {
      title: "Git e GitHub Avançado",
      description: "Aprenda estratégias avançadas de versionamento e colaboração com Git.",
      type: "Curso"
    },
    {
      title: "Fundamentos de Agile e Scrum",
      description: "Curso prático sobre metodologias ágeis e gestão de times dev.",
      type: "Curso"
    },

    // Artigos
    {
      title: "Clean Code na Prática",
      description: "Conceitos de código limpo aplicados no dia a dia de desenvolvimento.",
      type: "Artigo"
    },
    {
      title: "Como escalar produtos digitais",
      description: "Técnicas e estratégias para escalar plataformas digitais em ambiente real.",
      type: "Artigo"
    },
    {
      title: "Como montar seu portfólio dev",
      description: "Dicas práticas e modernas para montar um portfólio impactante.",
      type: "Artigo"
    },
    {
      title: "O que todo dev precisa saber sobre HTTP",
      description: "Entendendo as bases da comunicação web moderna.",
      type: "Artigo"
    },
    {
      title: "Refatoração: quando e como fazer",
      description: "Identificando o momento certo e aplicando refatoração com segurança.",
      type: "Artigo"
    },

    // Projetos
    {
      title: "Plataforma de Estudos Full Stack",
      description: "Projeto completo usando React, Node, Prisma e Auth.",
      type: "Projeto"
    },
    {
      title: "App de Tarefas com Firebase",
      description: "Aplicativo para controle de tarefas com login e banco em tempo real.",
      type: "Projeto"
    },
    {
      title: "Clone do Trello com Drag & Drop",
      description: "Uma cópia funcional do Trello usando React e backend leve.",
      type: "Projeto"
    },
    {
      title: "Dashboard Financeiro com Gráficos",
      description: "Criação de painel com dados dinâmicos e gráficos animados.",
      type: "Projeto"
    },
    {
      title: "API RESTful de Produtos",
      description: "API com CRUD completo e autenticação para gestão de produtos.",
      type: "Projeto"
    }
  ];

  for (const item of items) {
    await prisma.learningItem.create({ data: item });
  }

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
