'use strict'

var conn = require('./yami-connection'),
    CodeModel = () => { }

CodeModel.getCode = (data, cb) => conn.query('SELECT * FROM Code Where code = ?', data, cb)

CodeModel.updateCode = (data1, data2, cb) => conn.query('UPDATE Code SET idUser = ? WHERE code = ?',[data1,data2], cb)

module.exports = CodeModel
