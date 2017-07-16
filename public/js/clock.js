'use strict'

function clock(){
  var time = new Date()
  var hour = time.getHours()
  var minutes = time.getMinutes()
  var seconds = time.getSeconds()
  var timeOut = hour + " : " + minutes + " : " + seconds

  document.getElementById("counter").InnerHTML = timeOut

  setTimeout("clock()",1000)
}
