angular.module('app', ['app.filters', 'app.services', 'app.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/encuesta-ok', {
        templateUrl: '../../views/errorcitos',
        controller: SubmitSurveyController
      }).
      otherwise({
        redirectTo: '/encuesta-ok'
      });
    $locationProvider.html5Mode(true);
  }]);
