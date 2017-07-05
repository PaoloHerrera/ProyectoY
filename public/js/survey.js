(function() {
  'use strict';

  angular
    .module('app', [])
    .controller('SubmitSurveyController', ['$scope','$http', function($scope,$http) {

      $scope.submitForm = function() {
        console.log('valid');

        //METODO
        var message = 'Hola Mundo :D'
        $http({
          url: 'http://45.32.162.159/encuesta-respondida',
          method: "POST",
          data: { 'message' : message }
        })
        .then(function(response) {
            // success
            console.log("sí :)")
        },
        function(response) { // optional
            // failed
            console.log("no :(")
        });
      }

    }])
    .controller('StarController', RatingController)
    .directive('starRating', starRating);

  function RatingController() {
    this.rating = 1;
    this.isReadonly = true;
    this.rateFunction = function(star) {
      console.log('Rating selected: ' + star);
    };
  }

  function starRating() {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + // or &#9733
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue || newValue === 0) {
            updateStars();
          }
        });
      }
    };
  }
})();
