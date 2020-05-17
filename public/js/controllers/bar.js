angular.module('adminWebpage.bar', []).controller('BarController', function( $scope, $http, $window, $interval ) {

  //*
  //Fetch User
  //*
  $scope.fetchUser = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/user'
    })
    .then(function successCallback(response) {
      console.log('user',response);
    }, function errorCallback(response) {
      localStorage.clear();
      window.location.href= ("/index");
    });
  }

  //Log-Out
  $scope.logOut = function() {
    localStorage.clear();
    window.location.href= ("/index");
  }

  $interval( function() {
    $scope.fetchUser();
  }, 30000);
  $scope.fetchUser();
})
