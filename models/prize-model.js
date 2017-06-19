'use strict'

var conn = require('./yami-connection'),
    PrizeModel = () => {}

PrizeModel.getPrize = (data, cb) => conn.query('SELECT * FROM Prize WHERE Branch_idBranch = ?', data, cb)

module.exports = PrizeModel
