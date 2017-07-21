
var app = angular.module('countdown', []);

app.controller('CountdownCtrl', function($scope) {
  $scope.timePromo = new Date(date);

  $scope.timeTill = {};
  $scope.countdownPromo = "Cargando cuenta regresiva...";
  var updateClock = function(){
      $scope.timenow = new Date();
      $scope.seconds = ($scope.timePromo - $scope.timenow) / 1000;

      $scope.timeTill = {
        daysLeft: parseInt($scope.seconds / 86400),
        hoursLeft: parseInt($scope.seconds % 86400 / 3600),
        minutesLeft: parseInt($scope.seconds % 86400 % 3600 / 60),
        secondsLeft: parseInt($scope.seconds % 86400 % 3600 % 60)
      }

      $scope.countdownPromo = "Te quedan "+ $scope.timeTill.daysLeft + " días, "+ $scope.timeTill.hoursLeft+" horas, "+ $scope.timeTill.minutesLeft+" minutos, "+ $scope.timeTill.secondsLeft+" segundos.";
    };
    setInterval(function () {
      $scope.$apply(updateClock);
      }, 1000);
      updateClock();
    });
