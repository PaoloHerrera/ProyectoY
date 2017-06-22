'use strict'

var request = require('request')


exports.shorturl = function(url, callback){

  let username = "paolo@yami.cl",
      password = "paolinho1989",
      apiUrl = "http://45.32.162.159/yourls-api.php",
      format = "simple"

var r = request({
    url: apiUrl,
    method: "POST",
    headers : {
      Accept: "text/json"
    },
    form: {
      url : url,
      format : format,
      action : "shorturl",
      username : username,
      password : password
    }
  }, function(error, response, body){
    console.log(body)
    console.log('SHORT URL GENERADO!!')
    callback(null, body)

  })
  //console.log(r.form())
}
