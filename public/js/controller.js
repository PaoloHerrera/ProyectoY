var app = angular.module("app",[]);

app.controller("UsersController", function($scope){

$scope.formVisibility=false;


$scope.ShowSave=function(){

$scope.formVisibility=true;

}

$scope.Back=function(){

  $scope.formVisibility=false;

}

});
