console.log(hello);

var app = angular.module('countdown', []);

app.controller('CountdownCtrl', function($scope, hello) {

  console.log(hello);

  $scope.timePromo = new Date(2017, 12, 31, 23, 60);

  $scope.timeTill = {};
  var updateClock = function(){
      $scope.timenow = new Date();
      $scope.seconds = ($scope.timePromo - $scope.timenow) / 1000;

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
