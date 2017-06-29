'use strict'

var CodeModel = require('../models/prize-model'),
    SurveyController = () => {}

SurveyController.addForm = (req, res, next) => {
  let idUser = req.params.idUser,
      idPrize = req.params.idPrize

  //verifica si el premio ha sido cobrado
  //CodeModel
}


module.exports = SurveyController
