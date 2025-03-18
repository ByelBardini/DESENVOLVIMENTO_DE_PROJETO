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

app.post('/sintomas', upload.single('documento'), (req, res) =>{
  //Inserção dos dados em variáveis
  sintomas.push(req.body.sintomas)
  pdf.push(req.files)

  //Extração de texto do PDF
  let dataBuffer = fs.readFileSync('Teste.pdf');
 
  pdfParse(dataBuffer).then(function(data) {
 
    console.log(data.text); 
        
  });

  //Resposta pro Front
  res.status(201).json({ message: 'Dados recebidos com sucesso!', pdf })

})

app.listen(5500)

