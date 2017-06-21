'use strict'

var YamiController = require('../controllers/yami-controller'),
    UserController = require('../controllers/user-controller'),
    CodeController = require('../controllers/code-controller'),
    express = require('express'),
    router = express.Router()

router
      //usa la ruta del home
      .get('/', YamiController.addForm)

      //envía los datos del usuario (fono) por post a la interfaz código
      .post('/code', UserController.getUser)

      .post('/ingreso/:phone', CodeController.getCode)

      .get('/ruleta/:phone/:code', YamiController.addRoulette)

      .get('/premio/:iduser/:idprize', YamiController.addPrize)

      .get('/confirmarPremio/:prizeName/:idPrize/:idUser/:localName/:branchName', YamiController.prizeConfirm)

      .post('/confirmarPremio/:prizeName/:idPrize/:idUser/:localName/:branchName', YamiController.prizeSuccess)

      .post('/winprize', YamiController.addWinPrize)

      .use(YamiController.error404)

module.exports = router
