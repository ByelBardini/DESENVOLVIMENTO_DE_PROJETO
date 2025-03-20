import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import pdfParse from 'pdf-parse'

const upload = multer({ dest: 'uploads/' })

const app = express()

app.use(cors())

app.use(express.json())

const sintomas = []
const pdf = []
const medicacao = []

//Parte para retornar os diagnosticos
app.post('/sintomas', upload.single('documento'), (req, res) =>{
  //Inserção dos dados em variáveis
  sintomas.push(req.body.sintomas)

  //Extração de texto do PDF
  let dataBuffer = fs.readFileSync(req.file.path);
  
  pdfParse(dataBuffer).then(function(data) {
    console.log(data.text);
    pdf.push(data.text)

    const resposta = {
      sintomas: sintomas,
      pdf: pdf
    };
    //Fazer a pesquisa pro GPT aqui
  
    //Resposta pro Front
    res.status(201).json({ message: 'Dados recebidos com sucesso!', resposta })
  })

  });

//Parte para retornar os medicamentos
app.post('/diagnostico', (req, res) =>{
  //Inserção dos dados em variáveis
  medicacao.push(req.body.diagnostico)

  //Fazer aqui a pesquisa a respeito da medicação
  const resposta = {
    medicacao: medicacao
  };

  //Resposta pro Front
  res.status(201).json({ message: 'Dados recebidos com sucesso!', resposta })
})

app.listen(5500)
console.log("app.js iniciado")

