# Capyba Academy

Capyba Academy é uma solução educacional desenvolvida para facilitar o compartilhamento e acesso a cursos, artigos e projetos recomendados pela empresa Capyba para seus colaboradores. O objetivo é tornar o aprendizado mais prático e acessível, promovendo o crescimento profissional dentro da organização.

Durante o processo de desenvolvimento, foi simulado um ecossistema de trabalho real com uso de **commits frequentes** e **merge requests**, reforçando práticas de versionamento e entregas contínuas para demonstrar organização e controle no ciclo de desenvolvimento.

---

## 🚀 Tecnologias Utilizadas

### Backend

- Node.js + Express
- Prisma ORM
- PostgreSQL (Bitnami)
- JWT para autenticação
- Nodemailer para verificação de e-mail
- Jest + Supertest para testes automatizados

### Frontend

- React + Vite
- Context API
- Axios para requisições HTTP
- Estilização com CSS Modules
- Nginx (em produção, via Docker)

---

## 🏗️ Arquitetura do Projeto

### Backend

- **Controllers**: Gerenciam requisições e respostas da API, conectando as rotas à lógica de negócio.
- **Middlewares**: Realizam autenticação, validação de e-mail, permissões de administrador etc.
- **Rotas (Routes)**: Endpoints da API organizados por domínio da aplicação.
- **Testes**: Criados com Jest e Supertest, focando em autenticação, validação de e-mails e associação de interesses.

### Frontend

O frontend foi desenvolvido com apoio de uma inteligência artificial para agilizar a entrega inicial. A base foi criada com componentes reutilizáveis, foco em usabilidade e integração futura com toda a API backend.

---

## 📦 Rodando o Projeto

### 🔧 1. Clonar o repositório

```bash
git clone https://github.com/viniciuslidington/API-RESTful-Capyba.git
cd API-RESTful-Capyba
```

---

## ✅ Rodar a aplicação com Docker

```bash
docker-compose up --build
```

A aplicação estará disponível em:

- **Frontend**: http://localhost:5173
- **Backend (API)**: http://localhost:3000
- **PostgreSQL**: localhost:5432 (user: docker / pass: docker)

> ⚠️ Lembre-se de configurar as variáveis de ambiente no arquivo `.env`, conforme o exemplo disponível.

---

## 🔧 Executar localmente via terminal

Você pode rodar a aplicação sem Docker da seguinte forma:

### Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Rodar os testes automatizados

### Backend
```bash
cd backend
npm install
npm test
```

---

## 🌐 Acessos Online (Deploy em Produção)

- 🔗 **Repositório:** https://github.com/viniciuslidington/API-RESTful-Capyba
- 💻 **Aplicação em Produção:** https://capybacademy.up.railway.app/
- 📚 **Documentação da API (Swagger):** https://backend-api-restful-capyba-production.up.railway.app/api-docs

---

## 📖 Documentação OpenAPI / Swagger

A documentação Swagger permite explorar todos os endpoints da API de forma visual e interativa.

### Como acessar:

1. Garanta que a aplicação esteja rodando localmente ou no servidor.
2. Acesse no navegador: http://localhost:3000/api-docs
3. Explore os endpoints, parâmetros e respostas.

> Obs.: Na versão online, a documentação está disponível em:
> https://backend-api-restful-capyba-production.up.railway.app/api-docs

---

## 🔑 Funcionalidades de Autenticação

- Login com e-mail e senha
- Verificação de e-mail via link enviado por e-mail (com expiração de 5 minutos)
- Apenas usuários com e-mail verificado acessam a aba **Projetos**
- Atualização de perfil com troca de nome, e-mail, senha e foto

---

## 🛠️ Próximos Passos

- Aprimoramento do frontend com painel administrativo
- Marcar itens como "interesse" e "concluído"
- Melhorar feedback visual no frontend

---

## 🤝 Agradecimentos

Desenvolvido por [Vinícius Lidington](https://github.com/viniciuslidington) para o desafio da Capyba 🚀

