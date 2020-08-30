// Dados
const proffys = [
    {
        name: "Bernardo Moraes",
        avatar: "https://avatars2.githubusercontent.com/u/62802235?s=460&u=238931676a0d0f04658dcb1128dd162bf6418e49&v=4",
        whatsapp: "71 9999-0000", 
        bio: "Entusiasta das melhores tecnologias de química avançada.<br /><br     />Apaixonado por explodir coisas em laboratório e por mudar a vida das  pessoas através de experiências. Mais de 200.000 pessoas já passaram     por uma das minhas explosões.",
        subject: "Química", 
        cost: "40", 
        weekday: [
            0
        ], 
        time_from: [720], 
        time_to:  [1280]
    },
    {
        name: "Bernardo Moraes Silva",
        avatar: "https://avatars2.githubusercontent.com/u/62802235?s=460&u=238931676a0d0f04658dcb1128dd162bf6418e49&v=4",
        whatsapp: "71 9999-0000", 
        bio: "Entusiasta das melhores tecnologias de química avançada.<br/><br/>Apaixonado por explodir coisas em laboratório e por mudar a vida das  pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
        subject: "Química", 
        cost: "40", 
        weekday: [
            0
        ], 
        time_from: [720], 
        time_to:  [1280]
    }
]

const subjects = [
    "Artes",
    "Biologia",
    "Ciências",
    "Educação física",
    "Física",
    "Geografia",
    "História",
    "Matemática",
    "Português",
    "Química"
]

const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
]

// Funcionalidades
function getSubject(subjectNumber) {
    return subjects[subjectNumber]
}


function pageLanding (req, res) {
    // Agora estamos usando a renderização do Nunjuncks
    return res.render("index.html") // usavamos antes => res.render(__dirname +"/views/index.html" )
}

function pageStudy (req, res){
    const filters = req.query
    console.log(filters)
    // Antes => res.sendFile(__dirname + "/views/study.html")
    // return res.render("study.html", {proffy: proffys[0]}) // Essa variável proffy, pode assumir qualquer nome
    return res.render("study.html", {proffys, filters, subjects, weekdays})
}

function pageGiveClasses (req, res) {
    const data = req.query
    //
    const dataArray = Object.keys(data) // transforma o objeto em um array de arrays
    // para verificar se o objeto está vazio, faremos uma verificação do tamanho do array, se for != 0, faça ...
    if (dataArray.length != 0) { // um objeto vazio retorna true, então não poodemos deixar apenas a variável como condition
        data.subject = getSubject(data.subject)
        
        // Adicionar data a lista de proffys
        proffys.push(data)
        // redirecionar caso tenha tudo dado certo a pagina de give, classes para ver o resultado
        return res.redirect('/study')
    }

    // caso o array esteja vazio, retorna para a página inicial
    return res.render("give-classes.html", {subjects, weekdays})
}

// Servidor
const express = require('express')
const server = express()

// Configurar nunjucks (template engine)
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true,
})

// Inicio e configuração do servidor
server
// configurar arquivos estáticos (CSS, Scripts, Images)
.use(express.static('public'))
//rotas da aplicação
.get('/', pageLanding)
.get('/study', pageStudy)
.get('/give-classes', pageGiveClasses)
.listen(5500)

