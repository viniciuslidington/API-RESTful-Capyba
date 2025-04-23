# Usa uma imagem otimizada para produção
FROM node:20-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos essenciais para instalar as dependências
COPY package.json package-lock.json ./

# Instala apenas dependências de produção
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

RUN npx prisma generate

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para rodar a aplicação e aplicar as migrações
CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js && node index.js"]