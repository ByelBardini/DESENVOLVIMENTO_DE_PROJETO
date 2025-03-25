import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import { PDFDocument } from 'pdf-lib'

const upload = multer({ dest: 'uploads/' })

const app = express()

app.use(cors())

app.use(express.json())

const sintomas = []
const pdf = []
const medicacao = []

//Função para gerar o PDF
const generatePDF = async (res) => {
  try {
    const pdfPath = 'RECEITUARIO.pdf'
    const pdfBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()

    // Preencher os campos do formulário
    const nomeField = form.getTextField('nome')
    const receitaField = form.getTextField('receita')
    const diaField = form.getTextField('dia')
    const mesField = form.getTextField('mes')
    const anoField = form.getTextField('ano')

    const nomePaciente = 'Jorge'

    nomeField.setText(nomePaciente)
    receitaField.setText('Tomar 2 comprimidos ao dia')
    diaField.setText('25')
    mesField.setText('03')
    anoField.setText('2025')

    form.flatten();
    const pdfBytesFilled = await pdfDoc.save()
    const outputDir = 'generated_files'
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

    const outputPath = `${outputDir}/RECEITA_${nomePaciente.replace(/\s+/g, '_').toUpperCase()}.pdf`
    fs.writeFileSync(outputPath, pdfBytesFilled)

    await res.download(outputPath)
  } catch (err) {
    console.error('Erro ao gerar o PDF:', err)
    res.status(500).send('Erro ao gerar o PDF')
  }
}

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



// Rota para gerar o PDF
app.get('/gerarpdf', (req, res) => {
  generatePDF(res);
});

app.listen(5500, () => {
  console.log('app.js iniciado na porta 5500');
});