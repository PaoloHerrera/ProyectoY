'use strict'

var mysql = require('mysql'),
    conf = require('./db-conf'),
    dbOptions = {
      host : conf.mysql.host,
      port : conf.mysql.port,
      user : conf.mysql.user,
      password : conf.mysql.pass,
      database : conf.mysql.db
    },
    myConnection = mysql.createConnection(dbOptions)

myConnection.connect((err) => {
  return(err) ? console.log(`Error al conectarse a la base de datos:
    ${err.stack}`) : console.log(`Conexión establecida con la base de datos N°: ${myConnection.threadId}`)
})

module.exports = myConnection
