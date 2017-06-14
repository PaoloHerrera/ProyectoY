'use strict'

var yami = require('../models/yami'),
    express = require('express'),
    path = require('path'),
    sms = require('./sendsms'),
    router = express.Router()

function error404(req,res,next){
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

router
      //usa el objeto para conectarse a la base de datos
      .use(yami)
      //usa la ruta del home
      .get('/', (req, res, next) =>{

        res.render('index')

      })
      //envía los datos del usuario (fono) por post a la interfaz código
      .post('/code', (req, res, next) => {

        req.getConnection((err, yami) =>{
          let phone = {
            phone : req.body.phone
          }
          //verifica si el usuario está creado
          yami.query('SELECT * FROM Usuario WHERE phone = ?', phone.phone, (err, rows) => {
            if(err)
            {
              throw(err)
            }
            else
            {
              let user = {
                data : rows
              }
              console.log(user.data)
              //si el usuario no está creado lo crea
              if(user.data.length == 0)
              {
                let newUser =
                {
                    phone : phone.phone,
                    fechaUltimoLogin : new Date()
                }
                //inserta los datos a la base de datos
                yami.query('INSERT INTO Usuario SET ?', newUser, (err, rows) => {
                  res.render('code', { phone: phone.phone })
                })
              }
              //si el usuario está creado
              else
              {
                let actUser = {fechaUltimoLogin : new Date()}

                //actualiza la fecha de su ultimo login
                yami.query('UPDATE Usuario SET ? WHERE phone = ?', [actUser,phone.phone],
                      (err, rows) =>{
                        res.render('code', { phone: phone.phone })
                      })
              }
            }
          })
        })
      })

      .post('/ingreso/:phone', (req, res, next) => {
        req.getConnection((err, yami) =>{
          let user = {
            phone : req.params.phone
          }
          let code = {
            code : req.body.code
          }
          //verifica si el código ingresado es correcto
          yami.query('SELECT * FROM Codigo Where codigo = ?', code.code, (err, row) => {
            if(err)
            {
              throw(err)
            }
            else
            {
              //si no encuentra el código
              if(row.length == 0)
              {
                res.send('El código no es válido')
              }
              //si el código ya está asignado
              else if(row[0].idUsuario != null)
              {
                res.send('El código ya no es válido')
              }
              //si el código no está asignado a un usuario
              else if(row[0].idUsuario == null)
              {
                yami.query('SELECT idUsuario FROM Usuario WHERE phone = ?', user.phone,
                    (err, idUser) => {

                      yami.query('UPDATE Codigo SET idUsuario = ? WHERE codigo = ?',
                          [ idUser[0].idUsuario, code.code], (err, rows) => {
                            console.log(idUser[0].idUsuario)
                            res.send('Felicidades tu código es válido')
                            //enviar SMS
                            sms.phone(user.phone)
                            sms.mess('YAMI: Felicidades, te has ganado un punto para jugar en la ruleta. Pronto te enviaremos un mensaje para que puedas jugar.')
                            sms.mandarSMS()

                          })
                    } )
              }
            }
          })
        })


      })


      .use(error404)

module.exports = router
