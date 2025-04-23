# Etapa 1: Build com Node
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:stable-alpine

# Copia os arquivos compilados da etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Substitui a configuração padrão do Nginx (opcional, se quiser customizar rotas)
# Caso ainda não tenha um nginx.conf, a padrão já funciona.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expondo porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
