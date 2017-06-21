'use strict'

var CodeModel = require('../models/code-model'),
    UserModel = require('../models/user-model'),
    short = require('./shortURL'),
    sms = require('./sendsms'),
    CodeController = () => { }

CodeController.getCode = (req, res, next) => {

  let code = {
    code : req.body.code
  }

  UserModel.getUser(req.params.phone, (err, rows) => {
    if (err) {
      throw(err)
    }
    else {
      let user = {
        data : rows
      }
      //si el usuario está baneado lo manda a la página principal
      if (user.data[0].ban == 1) {
        res.render('index')
      }
      else {
        //Usuario no está baneado
        CodeModel.getCode(code.code, (err, row) => {
          if(err)
            throw(err)
          else
          {
            //si no encuentra el código, no está asignado a un talonario o ya está asignado a un usuario
            if(row.length == 0 || row[0].idBook == null || row[0].idUser != null) {
              //aumenta el número de intentos fallidos
              let fails = user.data[0].fails
              fails++
              //si los intentos son iguales a 3 el usuario es baneado
              if(fails == 3){
                let actUser = {
                  ban : 1,
                  fails : 0
                }
                UserModel.updateUser(actUser, user.data[0].phone, (err) => {
                  if(err){
                    throw(err)
                  }
                  else {
                    res.send("Usted ha tratado de ingresar códigos erróneos en reiteradas ocasiones. Ha sido baneado por 6 horas.")
                  }
                })
              }
              //si los intentos fallidos son menores que 3
              else {
                let actUser = {
                  fails : fails
                }
                UserModel.updateUser(actUser, user.data[0].phone, (err) => {
                  if(err){
                    throw(err)
                  }
                  else {
                    res.send('El código no es válido')
                  }
                })
              }
            }
            else
            {
              let code = {
                code : req.body.code
              }
              //invoca al modelo de obtener usuario
              UserModel.getUser(user.data[0].phone, (err, _user) => {
                if(err)
                {
                  throw(err)
                }
                else {
                  console.log(_user)
                }
                let actCode ={
                  idUser : _user[0].idUser
                }
                //asigna el código al usuario
                CodeModel.updateCode(actCode, code.code, (err) => {
                  if(err)
                  {
                    throw(err)
                  }
                  else
                  {
                    //Generar short URL
                    short.shorturl("http://localhost:3000/ruleta"+_user[0].phone+"/"+code.code, (err, body) => {
                      if (err) {
                        throw(err)
                      }
                      else {
                        console.log(body)
                        //enviar SMS
                        sms.phone(_user[0].phone)
                        sms.mess('YAMI: Felicidades!!!, puedes jugar a la ruleta presionando este link: \n' + body)
                        //sms.mandarSMS()
                        res.render('pointRoulette')
                      }
                    })

                  }
                })
              })
            }
          }
        })
      }
    }
  })
}

CodeController.updateCode = (req, res, next) => {

}

module.exports = CodeController
