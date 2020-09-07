// Servidor
const express = require('express')
const server = express()

const {pageLanding, pageStudy, pageGiveClasses, saveClasses} = require('./pages')

// Configurar nunjucks (template engine)
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true,
})

// Inicio e configuração do servidor
server
// Receber os dados do Reg Body
.use(express.urlencoded({extended: true}))
// configurar arquivos estáticos (CSS, Scripts, Images)
.use(express.static('public'))
//rotas da aplicação
.get('/', pageLanding)
.get('/study', pageStudy)
.get('/give-classes', pageGiveClasses)
.post('/save-class', saveClasses)
.listen(5500)

