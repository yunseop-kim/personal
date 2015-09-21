var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

    $http.get('/webtest/test').success(function(res) {
        $scope.testlist = res;
    })









}]);