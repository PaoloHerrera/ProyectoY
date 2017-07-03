angular.module('app', [])
     .controller('SubmitSurveyController', ['$scope', function($scope) {
       $scope.quality = null;

       $scope.submitForm = function() {
         alert('valid');
       }

     }]);
