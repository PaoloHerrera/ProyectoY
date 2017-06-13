'use strict'

var yami = require('../models/yami'),
    express = require('express'),
    path = require('path'),
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

        res.sendFile(path.resolve('./views/index.html'))

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
                  res.sendFile(path.resolve('./views/code.html'))
                })
              }
              //si el usuario está creado
              else
              {
                let actUser =
                {
                    fechaUltimoLogin : new Date()
                }
                //actualiza la fecha de su ultimo login
                yami.query('UPDATE Usuario SET ? WHERE phone = ?', [actUser,phone.phone],
                      (err, rows) =>{
                        res.sendFile(path.resolve('./views/code.html'))
                      })
              }
            }
          })
        })
      })

      .post('/ingreso', (req, res, next) => {
        req.getConnection((err, yami) =>{
          let user = {
            //phone : req.
          }
          let code = {
            code : req.body.code
          }
          console.log(user.phone)
          console.log(code.code)
          //verifica si el código ingresado es correcto
          yami.query('SELECT * FROM Codigo Where codigo = ?', code.code, (err, rows) => {
            if(err)
            {
              throw(err)
            }
            else
            {
              let codeBDD = {
                data : rows
              }
              //si no encuentra el código
              console.log(codeBDD.data)

              if(codeBDD.data.length == 0)
              {
                res.send('El código no es válido')
              }
              //si el código ya está asignado
            /*  else if(codeBDD.data.idUsuario != null)
              {
                res.send('El código ya no es válido')
              }
              //si el código no está asignado a un usuario
              else if(code.data.idUsuario == null)
              {
                //yami.query('UPDATE ')
              }*/
            }
          })
        })


      })


      .use(error404)

module.exports = router
