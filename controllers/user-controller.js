'use strict'

var UserModel = require('../models/user-model'),
    UserController = () => { }

//Controlador para obtener a un usuario
UserController.getUser = (req, res, next) => {
  //guarda el número de teléfono ingresado por el usuario
  let phone = {
    phone : req.body.phone
  }
  //llama al modelo para obtener al usuario
  UserModel.getUser(phone.phone, (err, rows) => {
    if(err){
      throw(err)
    }
    else{
      let user = {
        data : rows
      }
      //si el usuario no está creado lo crea
      if(user.data.length == 0){
        //crea un nuevo usuario
        let newUser =
        {
          phone : phone.phone,
          fechaUltimoLogin : new Date()
        }
        //invoca al modelo de insertar usuario
        UserModel.insertUser( newUser, (err) =>{
          if(err)
          {
            throw(err)
          }
          else
          {
            res.render('code', { phone: newUser.phone })
          }
        })
      }
      //si el usuario está creado
      else {
        //si el usuario no está baneado
        if(user.data[0].baneado == 0) {
          //actualiza la fecha de su ultimo login
          let actUser = {
            phone : phone.phone,
            fechaUltimoLogin : new Date()
          }
          //invoca al modelo de actualizar un usuario
          UserModel.updateDateUser(actUser.fechaUltimoLogin, actUser.phone, (err) => {
            if(err)
            {
              throw(err)
            }
            else
            {
              res.render('code', { phone: actUser.phone })
            }
          })
        }
        //si el usuario está baneado
        else {
          //verificar si han pasado 3 horas después del baneo
          let dateNow = new Date()
          let difference = dateNow.getTime() - user.data[0].fechaUltimoLogin.getTime()
          var hoursDifference = Math.floor(difference/1000/60/60)
          //si el usuario ha estado baneado por 6 horas o más se desbanea
          if(hoursDifference >= 6){
            let desbanUser ={
              fechaUltimoLogin : dateNow,
              baneado : 0,
              intentos : 0
            }
            //invoca al modelo de update User
            UserModel.updateUser(desbanUser, phone.phone, (err) => {
              if(err){
                throw(err)
              }
              else {
                res.render('code', { phone: phone.phone } )
              }
            })
          }
          else {
            res.send('Lo sentimos, usted no puede ingresar. Vuelva a intentarlo más tarde')
          }
        }
      }
    }
  })
}

//Controlador de insertar un nuevo usuario
UserController.insertUser = (req, res, next) => {

}

//Controlador de actualizar un usuario
UserController.updateUser = (req, res, next) => {

}

module.exports = UserController
