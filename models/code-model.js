'use strict'

var conn = require('./yami-connection'),
    CodeModel = () => { }

CodeModel.getCode = (data, cb) => conn.query('SELECT * FROM Codigo Where codigo = ?', data, cb)

CodeModel.updateCode = (data1, data2, cb) => conn.query('UPDATE Codigo SET idUsuario = ? WHERE codigo = ?',[data1,data2], cb)

module.exports = CodeModel
