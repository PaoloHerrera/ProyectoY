'use strict'

var conn = require('./yami-connection'),
    BookModel = () => {}

BookModel.getBook = (data, cb) => conn.query('SELECT * FROM Book WHERE idBook = ?', data, cb)

module.exports = BookModel
