'use strict'

var CodeModel = require('../models/code-model'),
    UserModel = require('../models/user-model'),
    sms = require('./sendsms'),
    CodeController = () => { }

CodeController.getCode = (req, res, next) => {
  let user = {
    phone : req.params.phone
  }
  let code = {
    code : req.body.code
  }

  CodeModel.getCode(code.code, (err, row) => {
    if(err)
      throw(err)
    else
    {
      //si no encuentra el código, no está asignado a un talonario o ya está asignado a un usuario
      if(row.length == 0 || row[0].idTalonario == null || row[0].idUsuario != null)
        res.send('El código no es válido')
      else
      {
        let user = {
          phone : req.params.phone
        }
        let code = {
          code : req.body.code
        }
        //invoca al modelo de obtener usuario
        UserModel.getUser(user.phone, (err, _user) => {
          CodeModel.updateCode(_user[0].idUsuario, code.code, (err) => {
            if(err)
            {
              throw(err)
            }
            else
            {
              console.log(_user[0].idUsuario)
              res.send('Felicidades tu código es válido')
              //enviar SMS
              sms.phone(user.phone)
              sms.mess('YAMI: Felicidades, te has ganado un punto para jugar en la ruleta. Pronto te enviaremos un mensaje para que puedas jugar.')
              //sms.mandarSMS()
              }
            })
          })
        }
      }
    })
}

CodeController.updateCode = (req, res, next) => {

}

module.exports = CodeController
