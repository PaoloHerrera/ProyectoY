'use strict'

var request = require('request')


exports.shorturl = function(url, callback){

  let username = "paolo",
      password = "paolinho",
      apiUrl = "http://localhost/yourls/yourls-api.php",
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
