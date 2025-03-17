import express from 'express'
import cors from 'cors'
import multer from 'multer'

const upload = multer({ dest: 'uploads/' })

const app = express()

app.use(cors())

app.use(express.json())

const sintomas = []
const pdf = []

app.post('/sintomas', upload.single('documento'), (req, res) =>{

  sintomas.push(req.body.sintomas)
  pdf.push(req.files)

  res.status(201).json({ message: 'Dados recebidos com sucesso!', pdf })

})

app.listen(5500)

