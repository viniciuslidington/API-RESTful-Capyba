# Capyba Academy

Capyba Academy é uma solução educacional desenvolvida para facilitar o compartilhamento e acesso a cursos, artigos e projetos recomendados pela empresa Capyba para seus colaboradores. O objetivo é tornar o aprendizado mais prático e acessível, promovendo o crescimento profissional dentro da organização.

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
git clone https://github.com/sua-org/capyba-academy.git
cd capyba-academy
```

### 🐳 2. Rodar com Docker (recomendado)

```bash
docker-compose up --build
```

A aplicação estará disponível em:

- **Frontend**: http://localhost:5173
- **Backend (API)**: http://localhost:3000
- **PostgreSQL**: localhost:5432 (user: docker / pass: docker) - Banco containerzado pelo docker
  obs.: Caso queria rodar localmente pelo terminal, é necessário criar um container expecífico para o banco postgres.

> ⚠️ Lembre-se de configurar variáveis de ambiente no `.env`.

---

### 🧪 3. Rodar os testes automatizados

#### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   npm test  

   ```

### 📖 Documentação OpenAPI e Swagger

A documentação Swagger é uma ferramenta poderosa para entender e interagir com os endpoints, parâmetros e respostas da API. Siga os passos abaixo para acessá-la:

#### Passo a Passo:

1. Certifique-se de que a aplicação está rodando localmente ou no servidor.
2. Abra um navegador web.
3. Navegue até o endpoint do Swagger UI : [EndPoint APIs REST](http://localhost:3000/api-docs).
4. Explore os endpoints disponíveis e seus detalhes.

> **Nota:**
>
> - A URL exata para a documentação Swagger pode variar dependendo do framework ou configuração utilizada.
> - Certifique-se de que o Swagger está devidamente configurado na aplicação para gerar a documentação.

## 🔑 Autenticação

- Login com e-mail e senha
- Usuários só podem acessar a aba "Projetos" após validarem o e-mail
- Possível editar perfil, trocar senha e fazer upload de imagem

---

## 🛠️ Próximos Passos

- 🔜 Aprimoramento do frontend com acesso administrativo
- 🔜 Funcionalidade para manipulação de itens pelos usuários

---

## 🤝 Agradecimentos

Projeto desenvolvido por [Vinícius Lidington](https://github.com/viniciuslidigton)
