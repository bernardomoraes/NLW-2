const Database = require('./database/db')

const {subjects, weekdays, getSubject, convertHoursToMinutes} = require('./utils/format')

function pageLanding (req, res) {
    // Agora estamos usando a renderização do Nunjuncks
    return res.render("index.html") // usavamos antes => res.render(__dirname +"/views/index.html" )
}

async function pageStudy (req, res){
    const filters = req.query
    
    if (!filters.subject || !filters.weekday || !filters.time) {
        return res.render("study.html", {filters, subjects, weekdays })
    }

    // console.log('Não tem campos vazios')
    
    // converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}'
    `

    //caso haja erro na hora da consulta do banco de dados
    try {
        const db = await Database
        const proffys = await db.all(query)
        
        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render('study.html', {proffys, subjects, filters, weekdays})

    } catch (error) {
        console.log(error)
    }

    // Antes => res.sendFile(__dirname + "/views/study.html")
    // return res.render("study.html", {proffy: proffys[0]}) // Essa variável proffy, pode assumir qualquer nome
}

function pageGiveClasses (req, res) {
    // const data = req.body
    // //
    // const dataArray = Object.keys(data) // transforma o objeto em um array de arrays
    // // para verificar se o objeto está vazio, faremos uma verificação do tamanho do array, se for != 0, faça ...
    // if (dataArray.length != 0) { // um objeto vazio retorna true, então não poodemos deixar apenas a variável como condition
    //     data.subject = getSubject(data.subject)
        
    //     // Adicionar data a lista de proffys
    //     proffys.push(data)
    //     // redirecionar caso tenha tudo dado certo a pagina de give, classes para ver o resultado
    //     return res.redirect('/study')
    // }

    // caso o array esteja vazio, retorna para a página inicial
    return res.render("give-classes.html", {subjects, weekdays})
}

async function saveClasses(req, res) {
    const createProffy = require ('./database/createProffy')

    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }
    
    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }

    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHoursToMinutes(req.body.time_from[index]),
            time_to: convertHoursToMinutes(req.body.time_to[index])
        }
    })

    try {
    const db = await Database
    await createProffy (db, {proffyValue, classValue, classScheduleValues})
    
    let queryString = "?subject=" + req.body.subject
    queryString += "&weekday=" + req.body.weekday[0]
    queryString += "&time=" + req.body.time_from[0]


    return res.redirect('/study' + queryString)
    
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}