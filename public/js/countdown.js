// autor ... http://personal-de-jall.webcindario.com
// contacto ... ja_lopezl@yahoo.es
// estas dos variables se pueden modificar para
// adaptarlas a sus necesidades
//fecha de referencia del contador: fin del año 2008
var futuro = date;
//actualiza el contador cada 4 segundos ( = 4000 milisegundos)
var actualiza = 1000;
// función que calcula y escribe el tiempo en días, horas, minutos y segundos
// que faltan para la variable futuro
function faltan() {
    var ahora = new Date();
    var faltan = futuro - ahora;
    // si todavís no es futuro
    if (faltan > 0) {
        var segundos = Math.round(faltan / 1000);
        var minutos = Math.floor(segundos / 60);
        var segundos_s = segundos % 60;
        var horas = Math.floor(minutos / 60);
        var minutos_s = minutos % 60;
        var dias = Math.floor(horas / 24);
        var horas_s = horas % 24;
        // escribe los resultados
        (segundos_s < 10) ? segundos_s = "0" + segundos_s : segundos_s = segundos_s;
        (minutos_s < 10) ? minutos_s = "0" + minutos_s : minutos_s = minutos_s;
        (horas_s < 10) ? horas_s = "0" + horas_s : horas_s = horas_s;
        (dias < 10) ? dias = "0" + dias : dias = dias;
        var resultado = "Te quedan " + dias + " dias : " + horas_s + " horas : " + minutos_s + " minutos : " + segundos_s + " segundos";
        document.promoConfirmed.reloj.value = resultado;
        //actualiza el contador
        setTimeout("faltan()", actualiza);
    }
    // estamos en el futuro
    else {
        document.promoConfirmed.reloj.value = "00 dias : 00 horas : 00 minutos : 00 segundos";
    }
  }
  faltan();
