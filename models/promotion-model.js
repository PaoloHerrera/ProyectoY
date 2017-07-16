'use strict'

var conn = require('./yami-connection'),
    PromotionModel = () => {}

PromotionModel.getPromotion = (data, cb) => conn.query('SELECT * FROM Promotion WHERE ?', data, cb)

PromotionModel.updatePromotion = (data1, data2, cb) => conn.query('UPDATE Promotion SET ? WHERE idPromotion = ?', [data1, data2], cb)

module.exports = PromotionModel
