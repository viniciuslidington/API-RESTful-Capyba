import { PrismaClient } from '@prisma/client';
import { learningItemsSeed } from './learningItems.seed.js';
const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Inserindo dados iniciais...');

  // Cria usuário fictício
  const user = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@admin.com',
      password: '123456', // hash em app real
      emailVerified: true,
      image: null,
    },
  });

  console.log('👤 Usuário criado:', user.email);

  // Cria os itens de aprendizado
  const createdItems = [];
  for (const item of learningItemsSeed) {
    const created = await prisma.learningItem.create({
      data: {
        title: item.title,
        description: item.description,
        type: item.type,
        public: true,
      },
    });
    createdItems.push(created);
  }

  console.log(`📚 ${createdItems.length} itens criados.`);

  // Marca interesse do usuário nos 5 primeiros itens
  for (let i = 0; i < 5; i++) {
    await prisma.userLearningItem.create({
      data: {
        userId: user.id,
        learningItemId: createdItems[i].id,
      },
    });
  }

  console.log('⭐ Interesses registrados para os primeiros 5 itens.');
  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
