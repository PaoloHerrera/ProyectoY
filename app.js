'use strict'

var express = require('express'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    pug = require('pug'),
    restFul = require('express-method-override')('_method'),
    bodyParser = require('body-parser'),
    routes = require('./routes/yami-router'),
    faviconURL = `${__dirname}/public/img/favicon.png`,
    publicDir = express.static(`${__dirname}/public`),
    viewDir = `${__dirname}/views`,
    port = (process.env.PORT || 3000),
    app = express()

app
    //configuración de app
    .set('views', viewDir)
    .engine('html', pug.renderFile)
    .set('view engine', 'html')
    .set('port', port)
    //ejecutando middlewares
    .use(favicon( faviconURL ))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use( morgan('dev') )
    .use(publicDir)
    //ejecutando el middleware Enrutador
    .use(routes)

module.exports = app
