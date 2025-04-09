const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // permite ler JSON no corpo das requisições

app.get('/', (req, res) => {
  res.send('Servidor está rodando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
