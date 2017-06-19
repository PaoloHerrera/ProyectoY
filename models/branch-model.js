'use strict'

var conn = require('./yami-connection'),
    BranchModel = () => {}

BranchModel.getBranch = (data, cb) => conn.query('SELECT * FROM Branch WHERE idBranch = ?', data, cb)

module.exports = BranchModel
