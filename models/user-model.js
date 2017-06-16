'use strict'

var conn = require('./yami-connection'),
    UserModel = () => {}

UserModel.getUser = (data, cb) => conn.query('SELECT * FROM Usuario WHERE phone = ?', data, cb)

UserModel.insertUser = (data, cb) => conn.query('INSERT INTO Usuario SET ?', data, cb)

UserModel.updateDateUser = (data1, data2, cb) => conn.query('UPDATE Usuario SET fechaUltimoLogin = ? WHERE phone = ?', [data1, data2], cb)

UserModel.updateUser = (data1, data2, cb) => conn.query('Update Usuario SET ? WHERE phone = ?', [data1, data2], cb)
module.exports = UserModel
