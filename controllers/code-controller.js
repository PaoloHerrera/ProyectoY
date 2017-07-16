'use strict'

var CodeModel = require('../models/code-model'),
    UserModel = require('../models/user-model'),
    BookModel = require('../models/book-model'),
    BranchModel = require('../models/branch-model'),
    LocalModel = require('../models/local-model'),
    PromotionModel = require('../models/promotion-model'),
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
                idCode: row[0].idCode,
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
                  idUser : _user[0].idUser,
                  codeDate: new Date()
                }
                //asigna el código al usuario
                CodeModel.updateCode(actCode, code.code, (err) => {
                  if(err)
                  {
                    throw(err)
                  }
                  else
                  {
                    //Extraer la id de la sucursal
                    BookModel.getBook(row[0].idBook, (err, bookRow) => {
                      if (err) {
                        throw(err)
                      }
                      else {
                        let book = bookRow[0]

                        //Extraer el la sucursal
                        BranchModel.getBranch(book.idBranch, (err, branchRow) => {
                          if (err) {
                            throw(err)
                          }
                          else {
                            let branch = branchRow[0]

                            //Extrae el local
                            LocalModel.getLocal( branch.idLocal, (err, localRow) => {
                              if (err) {
                                throw(err)
                              }
                              else {
                                let local = localRow[0]

                                //Generar time Out de la encuesta
                                setTimeout(() => {
                                  //Generar short URL para la encuesta
                                  short.shorturl("http://yamiapp.co/encuesta/"+_user[0].phone+"/"+code.code, (err, body) => {
                                    if (err) {
                                      throw(err)
                                    }
                                    else {
                                      //mandar SMS
                                      sms.phone(_user[0].phone)
                                      sms.mess(local.localName+': Gracias por venir a nuestro local en ' + branch.branchName + '\nResponde esta breve encuesta para participar por un premio\n' +  body )
                                      sms.mandarSMS()
                                    }
                                  })
                                }, 300000)
                              /* Promociones */
                                //Se consultan si hay promociones
                                let codeQuery = {
                                  idCode: code.idCode
                                }
                                PromotionModel.getPromotion(codeQuery, (err, promotions) => {
                                  if(err){
                                    throw(err)
                                  }
                                  else {
                                    //Si hay promociones para el código
                                    if(promotions.length != 0){

                                      let promotion1 = promotions[0],
                                          promotion2 = promotions[1],
                                          promotion3 = promotions[2]

                                      //** Ahora manda las promociones para cada código en un tiempo determinado. **Ver esto después, cuando se tire a producción
                                      //Generar time Out de la primera promoción
                                      setTimeout(() => {
                                        //Generar short URL para la promoción
                                        short.shorturl("http://yamiapp.co/promocion/"+_user[0].phone+"/"+code.code+"/"+promotion1.idPromotion, (err, body) => {
                                          if (err) {
                                            throw(err)
                                          }
                                          else {
                                            let thetime = new Date(),
                                                actPromotion = {
                                                  activePromotion: 1,
                                                  timeStart: thetime,
                                                  timeFinish: thetime.setMinutes(200),
                                                  sendedPromotion: 1
                                                }
                                            PromotionModel.updatePromotion(actPromotion, promotion1.idPromotion, (err){
                                              if(err) {
                                                throw(err)
                                              }
                                              else{
                                                //mandar SMS
                                                sms.phone(_user[0].phone)
                                                sms.mess(local.localName+': Hace tiempo que no vienes a nuestro local y tenemos una promocion para ti. Para enterarte accede a este link:\n' +  body )
                                                sms.mandarSMS()
                                              }
                                            })
                                          }
                                        })
                                      }, 360000)

                                      //Generar time Out de la segunda promoción
                                      setTimeout(() => {
                                        //Generar short URL para la promoción
                                        short.shorturl("http://yamiapp.co/promocion/"+_user[0].phone+"/"+code.code+"/"+promotion2.idPromotion, (err, body) => {
                                          if (err) {
                                            throw(err)
                                          }
                                          else {
                                            let thetime = new Date(),
                                                actPromotion = {
                                                  activePromotion: 1,
                                                  timeStart: thetime,
                                                  timeFinish: thetime.setMinutes(200),
                                                  sendedPromotion: 1
                                                }
                                            PromotionModel.updatePromotion(actPromotion, promotion2.idPromotion, (err){
                                              if(err) {
                                                throw(err)
                                              }
                                              else{
                                                //mandar SMS
                                                sms.phone(_user[0].phone)
                                                sms.mess(local.localName+': Hace tiempo que no vienes a nuestro local y tenemos una promocion para ti. Para enterarte accede a este link:\n' +  body )
                                                sms.mandarSMS()
                                              }
                                            })
                                          }
                                        })
                                      }, 400000)

                                      //Generar time Out de la tercera promoción
                                      setTimeout(() => {
                                        //Generar short URL para la promoción
                                        short.shorturl("http://yamiapp.co/promocion/"+_user[0].phone+"/"+code.code+"/"+promotion3.idPromotion, (err, body) => {
                                          if (err) {
                                            throw(err)
                                          }
                                          else {
                                            let thetime = new Date(),
                                                actPromotion = {
                                                  activePromotion: 1,
                                                  timeStart: thetime,
                                                  timeFinish: thetime.setMinutes(200),
                                                  sendedPromotion: 1
                                                }
                                            PromotionModel.updatePromotion(actPromotion, promotion3.idPromotion, (err){
                                              if(err) {
                                                throw(err)
                                              }
                                              else{
                                                //mandar SMS
                                                sms.phone(_user[0].phone)
                                                sms.mess(local.localName+': Hace tiempo que no vienes a nuestro local y tenemos una promocion para ti. Para enterarte accede a este link:\n' +  body )
                                                sms.mandarSMS()
                                              }
                                            })
                                          }
                                        })
                                      }, 460000)


                                      //Generar time Out de la primera promoción
                                      setTimeout(() => {
                                        //Generar short URL para la promoción
                                        short.shorturl("http://yamiapp.co/promocion/"+_user[0].phone+"/"+code.code, (err, body) => {
                                          if (err) {
                                            throw(err)
                                          }
                                          else {
                                            //mandar SMS
                                            sms.phone(_user[0].phone)
                                            sms.mess(local.localName+': Hace tiempo que no vienes a nuestros locales y tenemos una promocion para ti. Para enterarte accede a este link:\n' +  body )
                                            sms.mandarSMS()
                                          }
                                        })
                                      }, 360000)

                                    }
                                  }
                                })

                                //Generar short URL para la ruleta
                                short.shorturl("http://yamiapp.co/ruleta/"+_user[0].phone+"/"+code.code, (err, body) => {
                                  if (err) {
                                    throw(err)
                                  }
                                  else {
                                    //enviar SMS
                                    sms.phone(_user[0].phone)
                                    sms.mess( local.localName + ': Felicidades!!!, puedes jugar a la ruleta presionando este link: \n' + body)
                                    sms.mandarSMS()
                                    res.render('pointRoulette')
                                  }
                                })
                              }
                            })
                          }
                        })
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
