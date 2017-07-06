'use strict'

var YamiModel = require('../models/yami-model'),
    CodeModel = require('../models/code-model'),
    UserModel = require('../models/user-model'),
    BookModel = require('../models/book-model'),
    BranchModel = require('../models/branch-model'),
    LocalModel = require('../models/local-model'),
    PrizeModel = require('../models/prize-model'),
    PrizeDetailModel = require('../models/prizedetail-model'),
    short = require('./shortURL'),
    sms = require('./sendsms'),
    YamiController = () => { }

YamiController.addForm = (req, res, next) => res.render('index')

YamiController.addWinPrize = (req, res, next) => {
	console.log('body: ' + JSON.stringify(req.body))
  let data = req.body

  //Asigna el código como usado
  console.log(data.code)
  let actCode = {
    codeUsed : 1,
    usedDate : new Date()
  }
  CodeModel.updateCode( actCode, data.code, (err) => {
    if (err) {
      throw(err)
    }
    else {
      //Asigna el premio al usuario
      let actPrize = {
        User_idUser : data.idUser,
        lastTryDate : new Date()
      }
      PrizeModel.updatePrize(actPrize, data.idPrize , (err) => {
        if (err) {
          throw(err)
        }
        else {
          //Generar short URL
          short.shorturl("http://yamiapp.co/premio/"+data.idUser+"/"+data.idPrize, (err, body) => {
            if (err) {
              throw(err)
            }
            else {
              console.log(body)
              //mandar SMS
              sms.phone(data.phone)
              sms.mess(data.localName + ': Felicidades te has ganado ' + data.prizeName +
              ' en '+data.localName+' '+data.branchName+'\nPara canjear tu premio presiona el link:\n' + body )
              sms.mandarSMS()
              res.send('SUCCESS!!!')
            }
          });
        }
      })
    }
  })
}

YamiController.addPrize = (req, res, next) => {
  let idUser = req.params.iduser,
      idPrize = req.params.idprize

  //Consulta si es que el usuario y el premio están asignados
  PrizeModel.getPrizeUser(idPrize, (err, row) => {
    if(err){
      throw(err)
    }
    else {
      let prize = row[0]

      //verifica si el usuario y el premio están asignados, y si el premio no ha sido recibido
      if( idUser == prize.User_idUser && prize.receivedPrize == 0){
        //extrae el detalle del premio
        PrizeDetailModel.getPrizeDetail(prize.PrizeDetail_idPrizeDetail, (err, detailRow) => {
          if(err){
            throw(err)
          }
          else {
            let detail = detailRow[0]
            //Extrae el nombre de la sucursal
            BranchModel.getBranch(prize.Branch_idBranch, (err, branchRow) => {
              if(err){
                throw(err)
              }
              else {
                let branch = branchRow[0]
                //Extrae el nombre del local
                LocalModel.getLocal(branch.idLocal, (err, localRow) => {
                  if(err){
                    throw(err)
                  }
                  else {
                    let local = localRow[0]

                    res.render('congratulations', { idUser: idUser, idPrize: prize.idPrize, prizeName : detail.prizeName, prizeImage : detail.prizeImage, branchName : branch.branchName, localName : local.localName, localLogo: local.localLogo})
                  }
                })
              }
            })
          }
        })
      }
      else {
        res.render('errorcitos')
      }
    }
  })

  console.log(idPrize)

}

YamiController.prizeConfirm = (req, res, next) => {
  let idPrize = req.params.idPrize,
      idUser = req.params.idUser

  //Consulata en la base de datos el premio
  PrizeModel.getPrizeUser(idPrize, (err, row) => {
    if (err) {
      throw(err)
    }
    else {
      let prize = row[0]

      //verifica si la id del usuario coincide en el premio y que el premio no haya sido cobrado
      if( idUser == prize.User_idUser && prize.receivedPrize == 0)
      {
        //extrae los detalles del premio
        PrizeDetailModel.getPrizeDetail(prize.PrizeDetail_idPrizeDetail, (err, detailRow) => {
          if (err) {
            throw(err)
          }
          else {
            let detail = detailRow[0]
            //extrae el branch
            BranchModel.getBranch(prize.Branch_idBranch, (err, branchRow) => {
              if(err){
                throw(err)
              }
              else {
                let branch = branchRow[0]

                //extrae el local
                LocalModel.getLocal(branch.idLocal, (err, localRow) => {
                  if (err) {
                    throw(err)
                  }
                  else {
                    let local = localRow[0]

                    res.render('prizeConfirm', {prizeImage : detail.prizeImage, idPrize: prize.idPrize, prizeName : detail.prizeName, idUser: idUser, localName: local.localName, localLogo: local.localLogo, branchName: branch.branchName})
                  }
                })
              }
            })
          }
        })

      }
      else {
        res.send('error')
      }

    }
  })
}

YamiController.prizeSuccess = (req, res, next) => {
  let idPrize = req.params.idPrize,
      idUser = req.params.idUser,
      localName = req.params.localName,
      branchName = req.params.branchName
  //el premio es cobrado
  let actPrize = {
    receivedPrize : 1,
    receivedDate : new Date()
  }

  PrizeModel.updatePrize(actPrize, idPrize, (err) => {
    if(err){
      throw(err)
    }
    else {
      //Extrae la información del premio
      PrizeModel.getPrizeUser( idPrize, (err, row) => {
        if (err) {
          throw(err)
        }
        else {
          let prize = row[0]
          //Extrae el detalle del premio
          PrizeDetailModel.getPrizeDetail( prize.PrizeDetail_idPrizeDetail, (err, detailRow) => {
            if(err){
              throw(err)
            }
            else {
              res.render('prizeSuccess', {prizeImage: detailRow[0].prizeImage})
            }
          })
        }
      })
    }
  })
}

YamiController.addRoulette = (req, res, next) => {

  let phone = req.params.phone,
      code = req.params.code,
      prizeFocus

  //Verificaciones :

  //Verifica si el usuario está asignado al código
  UserModel.getUser( phone, (err, row) => {
    if( err){
      throw(err)
    }
    else {
       CodeModel.getCode( code, (err, rows) => {
        if(err){
          throw(err)
        }
        else {
          //Si no encuentra el código o el usuario manda a la página de error
          if(rows.length == 0 || row.length == 0)
            res.render('errorcitos')
          else{
            if(row[0].idUser != rows[0].idUser){
              res.send('Error. Usted no tiene permiso para acceder.')
            }
            else {
              //código asignado al usuario

              //Verifica si el código ha sido utilizado
              if(rows[0].codeUsed == 1)
                res.render('errorcitos')
              else {
                /* Consulta premio del local */

                //Con el código se extrae el talonario
                let idBook = rows[0].idBook

                //Llama al modelo del talonario para extraer la id de la sucursal
                BookModel.getBook( idBook, (err, book) => {
                  if(err){
                    throw(err)
                  }
                  else {
                    //Con la id de la sucursal se consulta la sucursal
                    let idBranch = book[0].idBranch

                    //Llama al modelo de la sucursal
                    BranchModel.getBranch(idBranch, (err, _row) => {
                      if (err) {
                        throw(err)
                      }
                      else {
                        let branch = {
                          data : _row
                        }

                        //Se consulta el local
                        LocalModel.getLocal(branch.data[0].idLocal, (err, _rows) => {
                          if (err) {
                            throw(err)
                          }
                          else {
                            let local = {
                              data : _rows
                            }
                            //Se consultan los premios
                            PrizeModel.getPrize(idBranch, (err, prizeRows) => {
                              if(err) {
                                throw(err)
                              }
                              else {
                                let prize = {
                                  data : prizeRows
                                }

                                //Si no hay premios ingresados
                                if(prize.data.length == 0) {
                                  //el usuario juega igual pero no puede ganar
                                  console.log("Usted no puede ganar. No hay premios ingresados")
                                  res.render('roulette')
                                }
                                //Si hay premios insertados en la base de datos
                                else {
                                  //consulta los premios
                                  for (var i = 0; i < prize.data.length; i++) {
                                    //Guarda el premio si es que está disponible
                                    if (prize.data[i].User_idUser == null) {
                                      prizeFocus = prize.data[i]
                                      break
                                    }
                                  }
                                  //Verifica si es que hay premio disponible
                                  //Si hay premio disponible
                                  if(prizeFocus != null) {
                                    //Extrae los detalles del premio
                                    PrizeDetailModel.getPrizeDetail(prizeFocus.PrizeDetail_idPrizeDetail, (err, detailrow) => {

                                      if (err) {
                                        throw(err)
                                      }
                                      else {

                                        //Probabilidad de ganar el premio
                                        res.render('roulette', {
                                          idUser : row[0].idUser,
                                          userPhone : row[0].phone,
                                          code : code,
                                          localName : local.data[0].localName,
                                          localLogo : local.data[0].localLogo,
                                          branchName : branch.data[0].branchName,
                                          prizeId : prizeFocus.idPrize,
                                          prizeName : detailrow[0].prizeName,
                                          prizeImage : detailrow[0].prizeImage,
                                          prizeProb : 0
                                        })
                                      }
                                    })
                                  }
                                  //Ningún premio disponible
                                  else {
                                    //No hay probabilidad de ganar premio
                                    console.log("Ningún premio disponible")
                                    res.render('roulette')
                                  }
                                }
                              }
                            })
                          }
                        })
                      }
                    })

                  }
                })

              }
            }
          }
        }
      })
    }
  })
}

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
