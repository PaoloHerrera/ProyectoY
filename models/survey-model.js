'use strict'

var conn = require('./yami-connection'),
    SurveyModel = () => {}

SurveyModel.getSurvey = (data, cb) => conn.query('SELECT * FROM Survey WHERE ?', data, cb)

module.exports = SurveyModel
