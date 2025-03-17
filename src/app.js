import express from 'express'

const app = express()
app.use(express.json())

const sintomas = [];
const pdf = [];

app.post('/sintomas', (req, res) =>{
  console.log(req.body)

  sintomas.push(req.sintomas)
  pdf.push(req.dores)

  res.status(201).json(req.body)
})

app.listen(5500)

