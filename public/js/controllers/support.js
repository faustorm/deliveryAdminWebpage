angular.module('adminWebpage.support', []).controller('SupportController', function( $scope, $http, $window, $rootScope ) {
  //*
  //Verify User Log-In
  //*
  $scope.getPendingOrders = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/support/pending/order'
    })
    .then(function successCallback(response) {
      console.log(response);
      $scope.pendingOrders = response.data.data
    }, function errorCallback(response) {
    });
  }

  $scope.getPendingOrders();

})
