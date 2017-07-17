'use strict'

var UserModel = require('../models/user-model'),
    CodeModel = require('../models/code-model'),
    PromotionModel = require('../models/promotion-model'),
    BookModel = require('../models/book-model'),
    BranchModel = require('../models/branch-model'),
    LocalModel = require('../models/local-model'),
    PromotionController = () => {}

PromotionController.addForm = (req, res, next) => {
  let phone = req.params.phone,
      code = req.params.code,
      promotion = {
        idPromotion: req.params.idPromotion
      }

  //Verifica si el código está asociado al usuario
  /* Verifica si el usuario ingresó el código */
  UserModel.getUser( phone, (err, row) => {
    if( err){
      throw(err)
    }
    else {
      CodeModel.getCode( code , (err, codeRow) => {
        if (err) {
          throw(err)
        }
        else {
          //Si no encuentra el código o el usuario manda a la página de error
          if(codeRow.length == 0 || row.length == 0)
            res.render('errorcitos')
          else {
            let codeDB = codeRow[0]
            //Verica que las ids del usuario sean iguales
            if(row[0].idUser != codeDB.idUser)
                res.send('Error. Usted no tiene permiso para acceder.')
            else {
            /*código asignado al usuario*/
              //Verifica si la promoción está disponible
              PromotionModel.getPromotion(promotion, (err, promoRow) => {
                if(err){
                  throw(err)
                } else {
                  let promo = promoRow[0]

                  if(promo.activePromotion == 1){
                    //Llama al modelo del talonario para extraer la id de la sucursal
                    BookModel.getBook( codeDB.idBook, (err, book) => {
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
                                let local = _rows[0]

                                res.render('promotion', {
                                  phone: phone,
                                  code: code,
                                  idPromotion: promotion.idPromotion,
                                  promotionImage: promo.promotionImage,
                                  giftName: promo.giftName,
                                  numberType: promo.numberType,
                                  promotion: promo.promotion,
                                  timeFinish: promo.timeFinish,
                                  timeNow: new Date(),
                                  localName: local.localName,
                                  localLogo: local.localLogo
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                  else{
                    res.send('Usted no tiene esta promoción activa')
                  }
                }
              })
            }
          }
        }
      })
    }
  })
}

module.exports = PromotionController
