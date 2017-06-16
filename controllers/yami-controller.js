'use strict'

var YamiModel = require('../models/yami-model'),
    YamiController = () => { }

YamiController.addForm = (req, res, next) => res.render('index')

YamiController.error404 = (req, res, next) => {
  let error = new Error(),
      locals = {
        title : 'Error 404',
        description : 'Recurso no encontrado',
        error : error
      }

      error.status = 404

      res.render('error', locals)

      next()
}

module.exports = YamiController
