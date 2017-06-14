'use strict'

var request = require('request'),
    url = 'http://190.196.157.158/http/send-message',
    username = 'pruebasms',
    password = 'prueba17',
    message_type = 'sms.automatic',
    to,
    message,
    query

//función que establece el número de teléfono
exports.phone = function(phone)
{
  to = phone
  return to
}

//función que establece el mensaje
exports.mess = function(mess)
{
  message = mess
  return message
}

exports.mandarSMS = function()
{
  query = '?username='+username+'&password='+password+'&to='+to+'&message-type='+message_type+'&message='+message
  console.log(url+query)
  request({
    url     : url+query,
    method  : 'GET',
    headers : {
      Accept: 'text/json'
    }, function (error, response, body) {
        if (error) throw error;
        console.log(body);
        console.log('MENSAJE ENVIADO!!!');
      }
  });
}
