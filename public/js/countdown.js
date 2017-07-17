var app = angular.module('countdown', []);

app.value('serverData', window.serverData);

app.controller('CountdownCtrl',['serverData', function($scope, serverData) {

  console.log(serverData);

  $scope.timePromo = serverData;

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
    }]);
