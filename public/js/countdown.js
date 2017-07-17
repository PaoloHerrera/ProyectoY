var app = angular.module('countdown', []);

app.controller('CountdownCtrl', function($scopecle) {

  $scope.timePromo = new Date(2017, 12, 31, 23, 60)

  $scope.timeTill = {};
  var updateClock = function(){
      $scope.seconds = ($scope.timePromo – new Date()) / 1000;

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
