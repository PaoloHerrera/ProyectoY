'use strict'

var conn = require('./yami-connection'),
    UserModel = () => {}

UserModel.getUser = (data, cb) => conn.query('SELECT * FROM User WHERE phone = ?', data, cb)

UserModel.insertUser = (data, cb) => conn.query('INSERT INTO User SET ?', data, cb)

UserModel.updateDateUser = (data1, data2, cb) => conn.query('UPDATE User SET dateLastLogin = ? WHERE phone = ?', [data1, data2], cb)

UserModel.updateUser = (data1, data2, cb) => conn.query('Update User SET ? WHERE phone = ?', [data1, data2], cb)

module.exports = UserModel
