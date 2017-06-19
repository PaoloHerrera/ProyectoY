'use strict'

var conn = require('./yami-connection'),
    PrizeDetailModel = () => {}

PrizeDetailModel.getPrizeDetail = (data, cb) => conn.query('SELECT * FROM PrizeDetail WHERE idPrizeDetail = ?', data, cb)

module.exports = PrizeDetailModel
