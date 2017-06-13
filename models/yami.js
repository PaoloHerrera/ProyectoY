'use strict'

var mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    dbOptions = {
      host : 'localhost',
      port : 3306,
      user : 'root',
      password : 'admin',
      database : 'BDYami_0.1.1'
    },
    Yami = myConnection(mysql, dbOptions, 'request')

module.exports = Yami
