const app = require('./app')

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})