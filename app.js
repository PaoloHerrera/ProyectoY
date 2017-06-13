'use strict'

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    pug = require('pug'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    //faviconURL = __dirname + '/'
    publicDir = express.static(`${__dirname}/public`),
    viewDir = `${__dirname}/views`,
    port = (process.env.PORT || 3000),
    app = express()

app
    //configuración de app
    .set('views', viewDir)
    .set('view engine', 'pug')
    .set('port', port)
    //ejecutando middlewares
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use( morgan('dev') )
    .use(publicDir)
    //ejecutando el middleware Enrutador
    .use(routes)


module.exports = app
