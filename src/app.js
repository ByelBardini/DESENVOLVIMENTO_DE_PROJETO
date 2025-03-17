import express from 'express'

const app = express()

app.post('/sintomas', (req, res) =>{
  res.send('Ok, deu bom')
})

app.listen(5500)

