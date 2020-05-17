angular.module('adminWebpage.loans', []).controller('LoansController', function( $scope, $http, $window, $rootScope ) {
  //*
  //Loaders
  //*
  $scope.startLoading = function(){
    $('.spinnerDiv').show();
  };
  $scope.stopLoading = function(){
    $('.spinnerDiv').hide();
  };


  //*
  //Fetch One Bank Account
  //*
  $scope.fetchLoans = function(){
    $scope.startLoading();
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/loan/admin/approved/history'
    })
    .then(function successCallback(response) {
      $scope.loans = response.data.data;
      $scope.stopLoading();
    }, function errorCallback(response) {
      $scope.stopLoading();
    });
  }

  //Wrap Up
  $scope.fetchLoans();
})
