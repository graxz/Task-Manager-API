const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const PORT = process.env.PORT

//Para deixar o site temporiamente fora de area apenas descomentar o codigo abaixo e para levar ao ar comentar ele novamente
// app.use((req, res, next) => {
//     res.status(503).send('Site em manutencao!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})