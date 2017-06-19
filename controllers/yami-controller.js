'use strict'

var YamiModel = require('../models/yami-model'),
    CodeModel = require('../models/code-model'),
    UserModel = require('../models/user-model'),
    BookModel = require('../models/book-model'),
    BranchModel = require('../models/branch-model'),
    LocalModel = require('../models/local-model'),
    PrizeModel = require('../models/prize-model'),
    PrizeDetailModel = require('../models/prizedetail-model'),
    YamiController = () => { }

YamiController.addForm = (req, res, next) => res.render('index')

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
                        LocalModel.getLocal(idBranch, (err, _rows) => {
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
                                  res.render('roulette')
                                }
                                //Si hay premios insertados en la base de datos
                                else {
                                  //consulta los premios
                                  for (var i = 0; i < prize.data.length; i++) {
                                    //Guarda el premio si es que está disponible
                                    if (prize.data[i].receivedPrize == 0) {
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
                                        console.log('Hola Mundo')
                                        //Probabilidad de ganar el premio
                                        res.render('roulette')
                                      }
                                    })
                                  }
                                  //Ningún premio disponible
                                  else {
                                    //No hay probabilidad de ganar premio
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
