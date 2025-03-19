import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import cohere from 'cohere-ai'
import 'dotenv/config';

const apiKey = process.env.API_KEY;

const upload = multer({ dest: 'uploads/' })

const app = express()

app.use(cors())

app.use(express.json())

const sintomas = []
const pdf = []

//Função para geração de resposta
cohere.init(apiKey);
async function generateText(imputPrompt) {
  const response = await cohere.generate({
      model: 'command', 
      prompt: imputPrompt,
      max_tokens: 0
  });

  console.log(response.body.generations[0].text);
}

//Parte para retornar os diagnosticos
app.post('/diagnostico', upload.single('documento'), (req, res) =>{
  //Inserção dos dados em variáveis
  sintomas.push(req.body.sintomas)

  //Extração de texto do PDF
  let dataBuffer = fs.readFileSync(req.file.path);
  
  pdfParse(dataBuffer).then(function(data) {
    console.log(data.text); 
    pdf.push(data.text)
    const teste = data.text
  });

  const envio = 'Tendo em mente os seguinte sintomas: '+req.body.sintomas+', E tendo em vista a seguinte informação: '+teste+', Me gere SOMENTE um arquivo JSON com possíveis diagnósticos, e uma breve descrição do motivo de achar isso, E NADA MAIS'

  generateText(envio)

  //Resposta pro Front
  res.status(201).json({ message: 'Dados recebidos com sucesso!', pdf })
})

//Parte para retornar os medicamentos
/*app.post('/sintomas', upload.single('documento'), (req, res) =>{
  //Inserção dos dados em variáveis
  sintomas.push(req.body.sintomas)

  //Extração de texto do PDF
  let dataBuffer = fs.readFileSync(req.file.path);
  
  pdfParse(dataBuffer).then(function(data) {
    console.log(data.text); 
    pdf.push(data.text)        
  });

  //Resposta pro Front
  res.status(201).json({ message: 'Dados recebidos com sucesso!', pdf })
})*/

app.listen(5500)

