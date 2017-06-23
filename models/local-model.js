'use strict'

var conn = require('./yami-connection'),
    LocalModel = () => {}

LocalModel.getLocal = (data, cb) => conn.query('SELECT * FROM Local WHERE idLocal = ?', data, cb)

LocalModel.getLocalBranch = (data, cb) => conn.query('SELECT * FROM Local WHERE idBranch = ?', data, cb)

module.exports = LocalModel
