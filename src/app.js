const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5500;

// Usando CORS para permitir requisições do frontend
app.use(cors());

// Configuração do Multer (middleware para lidar com upload de arquivos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo com timestamp
  }
});

const upload = multer({ storage: storage });

// Rota POST para lidar com o upload
app.post('/api/upload', upload.single('pdf'), (req, res) => {
  const { sintomas } = req.body;  // Sintomas enviado como texto
  const file = req.file;           // Arquivo PDF enviado

  // Exibir no console ou processar os dados
  console.log('Sintomas:', sintomas);
  console.log('Arquivo recebido:', file);

  // Enviar a resposta para o frontend
  res.json({ message: 'Upload realizado com sucesso', file, sintomas });
});

// Configuração para aceitar a requisição OPTIONS (necessária para CORS)
app.options('/api/upload', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
