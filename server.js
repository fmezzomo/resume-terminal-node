// server.js
const express = require('express');
const path = require('path');
const app = express();

// Serve arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o terminal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para o JSON dos dados do currículo
app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'data.json'));
});

// Configura o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
