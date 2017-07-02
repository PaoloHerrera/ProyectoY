'use strict'

var UserModel = require('../models/user-model'),
    CodeModel = require('../models/code-model'),
    SurveyModel = require('../models/survey-model'),
    QuestionModel = require('../models/question-model'),
    SurveyController = () => {}

SurveyController.addForm = (req, res, next) => {
  let phone = req.params.phone,
      code = req.params.code

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

              /* Verifica si existe encuesta y si ha sido respondida */
              let querySurvey = {
                Code_idCode: codeDB.idCode
              }
              //extrae la encuesta
              SurveyModel.getSurvey( querySurvey, (err, surveyRow) => {
                if (err) {
                  throw(err)
                }
                else {
                  //Verifica si existe la encuesta y si no ha sido respondida
                  if(surveyRow.length == 0 || surveyRow[0].surveyComplete == 1)
                    res.send('Error, la encuesta no existe o ya ha sido respondida.')
                  else {
                    //Guarda la encuesta en una variable
                    let survey = surveyRow[0],
                        queryQuestion = {
                          idSurvey: survey.idSurvey
                        }
                    /* Extrae las preguntas de la encuesta */
                    QuestionModel.getQuestions(queryQuestion, (err, questionsRow) => {
                      if(err){
                        throw(err)
                      }
                      else {
                        if(questionsRow.length == 0)
                          res.send('Error. No hay preguntas en la encuesta.')
                        else {
                        /*Pendiente: extraer solamente las preguntas que no han sido respondidas y
                          de manera dinámica. Ahora siempre se mandan 4 preguntas (las pre-definidas).
                          Además, se debe asignar el tipo de pregunta en la BDD y consultarla (ej:
                          estrella, box, checkbox, etc.) */
                          var jsonQuestion = []
                          for( var i=0; i< questionsRow.length; i++){
                            var item = {}
                            item["question"+i] = questionsRow[i].question

                            jsonQuestion.push(item)
                          }

                          console.log(jsonQuestion)
                          /*res.render('survey', {
                            idSurvey : questionsRow[0].idSurvey,
                            question1 : questionsRow[0].question,
                            question2 : questionsRow[1].question,
                            question3 : questionsRow[2].question,
                            question4 : questionsRow[3].question

                          })*/
                        }
                      }
                    })
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


module.exports = SurveyController
