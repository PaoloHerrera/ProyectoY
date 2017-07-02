'use strict'

var conn = require('./yami-connection'),
    QuestionModel = () => {}

QuestionModel.getQuestions = (data, cb) => conn.query('SELECT * FROM Question WHERE ?', data, cb)

module.exports = QuestionModel
