import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import pdfParse from 'pdf-parse'
import { PDFDocument } from 'pdf-lib'
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
})

const upload = multer({ dest: 'uploads/' })

const date = new Date()
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
    receitaField.enableMultiline()
    const diaField = form.getTextField('dia')
    const mesField = form.getTextField('mes')
    const anoField = form.getTextField('ano')

    const nomePaciente = 'Jorge'

    nomeField.setText(nomePaciente)
    receitaField.setText('Duas aspirinhas')
    diaField.setText(String(date.getDate()).padStart(2, '0'))
    mesField.setText(String(date.getMonth() + 1).padStart(2, '0'))
    anoField.setText(String(date.getFullYear()))

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
  
  pdfParse(dataBuffer).then(async function(data) {
    console.log(data.text)
    pdf.push(data.text)

    //Fazer a pesquisa pro GPT aqui
    const completion = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {"role": "user", "content": `Suponha que você é um médico, e você recebe os seguintes dados de um paciente: "${pdf}", e além disso, em uma consulta com o mesmo, ele deu o seguinte relato: "${sintomas}", baseado nessas informações, me retorne alguns possíveis diagnósticos em formato JSON, mas apenas o texto, nem colocá-lo no fomato JSON, esse diagnóstico deve conter o nome, e uma descrição breve do mesmo, com os campos "diagnostico" e "descrição", retorne SOMENTE O TEXTO EM JSON, NADA ALÉM`},
      ],
    })
    const resposta = await completion;
    console.log(resposta.choices[0].message.content)
  
    //Resposta pro Front
    res.status(201).json(resposta.choices[0].message.content)
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

app.listen(3030, () => {
  console.log('app.js iniciado na porta 3030');
});