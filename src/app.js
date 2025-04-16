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

let sintomas = null
let pdf = null
let diagnostico = null
let medicacao = null
let nome = null

//Função para gerar o PDF
const gerarPDF = async (nome, medicacao, prescricao, res) => {
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

    nomeField.setText(nome)
    receitaField.setText(`${medicacao}\n${prescricao}`)
    diaField.setText(String(date.getDate()).padStart(2, '0'))
    mesField.setText(String(date.getMonth() + 1).padStart(2, '0'))
    anoField.setText(String(date.getFullYear()))

    form.flatten();
    const pdfBytesFilled = await pdfDoc.save()
    const outputDir = 'generated_files'
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

    const outputPath = `${outputDir}/RECEITA_${nome.toUpperCase()}.pdf`
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
  sintomas = req.body.sintomas
  console.log(sintomas)

  //Extração de texto do PDF
  let dataBuffer = fs.readFileSync(req.file.path);
  
  pdfParse(dataBuffer).then(async function(data) {
    pdf = data.text
    console.log(pdf)

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
    res.status(201).json(JSON.parse(resposta.choices[0].message.content))
  })
})

//Parte para retornar os medicamentos
app.post('/diagnostico', async (req, res) =>{
  //Inserção dos dados em variáveis
  diagnostico = req.body.diagnostico
  console.log(diagnostico)

  //Pesquisa da medicação aqui
  const  completion = openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
      {"role": "user", "content": `Suponha que você é um médico, você recebe os seguintes dados de um paciente: "${pdf}", e você teve um adiagnóstico a respeito dessa pessoa, depois de analisar os sintomas, chegou à seguinte conclusão: "${diagnostico}", agora, você tem que medicar ela, me retorne possíveis alternativas de medicação em fomato JSON, seguindo o padrão: "medicacao: AQUI A MEDICAÇÃO INDICADA, prescricao: AQUI O QUANTO A PESSOA DEVE TOMAR, A PRESCRIÇÃO", quero que você me retorne somente o TEXTO EM FORMATO DE JSON, NADA ALÉM, não use a sua formatação de JSON, somente o texto`},
    ],
  })
  const resposta = await completion;
    console.log(resposta.choices[0].message.content)
    
    //Resposta pro Front
    res.status(201).json(JSON.parse(resposta.choices[0].message.content))
})

// Rota para gerar o PDF
app.post('/gerarpdf', (req, res) => {
  const { nome, medicacao, prescricao } = req.body;

  console.log("Nome:", nome);
  console.log("Medicamento:", medicacao);
  console.log("Prescrição:", prescricao);

  gerarPDF(nome, medicacao, prescricao, res);
});



app.listen(3030, () => {
  console.log('app.js iniciado na porta 3030')
})