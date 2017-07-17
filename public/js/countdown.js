var app = angular.module('countdown', []);

app.controller('CountdownCtrl', function($scopecle) {

  $scope.timePromo = {
    date: new Date(“September 18, 2017 20:00:00”)
  }

  $scope.timeTill = {};
  var updateClock = function(){
      $scope.seconds = ($scope.timePromo.date – new Date()) / 1000;

      $scope.timeTill = {
        daysLeft: parseInt($scope.seconds / 86400),
        hoursLeft: parseInt($scope.seconds % 86400 / 3600),
        minutesLeft: parseInt($scope.seconds % 86400 % 3600 / 60),
        secondsLeft: parseInt($scope.seconds % 86400 % 3600 % 60)
      }
    };
    setInterval(function () {
      $scope.$apply(updateClock);
      }, 1000);
      updateClock();
    });
