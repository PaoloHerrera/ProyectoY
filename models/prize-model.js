'use strict'

var conn = require('./yami-connection'),
    PrizeModel = () => {}

PrizeModel.getPrize = (data, cb) => conn.query('SELECT * FROM Prize WHERE Branch_idBranch = ?', data, cb)

PrizeModel.getPrizeUser = (data, cb) => conn.query('SELECT * FROM Prize WHERE idPrize = ?', data, cb)

PrizeModel.updatePrize = (data1, data2, cb) => conn.query('UPDATE Prize SET ? WHERE idPrize = ?', [data1, data2], cb)

module.exports = PrizeModel
