angular.module('adminWebpage.payBills', ['adminWebpage.couponmodal']).controller('PayBillsController', function( $scope, $http, $window, $rootScope ) {
  $scope.weekYear = moment().format('W');
  $scope.modalInfo = {};
  console.log('here')
  $scope.startLoading = function(){
    $('.spinnerDiv').show();
  };
  $scope.stopLoading = function(){
    $('.spinnerDiv').hide();
  };

  //*
  //Retrieve Info place
  //
  $scope.getPlaceInfo = function(id) {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/place/profile?id=' + id
    })
    .then(function successCallback(response) {
      $scope.place = response.data.data[0];
      $scope.modalInfo.image = response.data.data[0].coverPicture;
      $scope.modalInfo.title = 'Depositar a ' + $scope.place.place;
      $scope.modalInfo.description = 'Sucursal ' + $scope.place.branch;
    }, function errorCallback(response) {
    });
  }

  //*
  //Fetch Pending Charges
  //*
  $scope.fetchPendingPlaces = function() {
    $http({
      method: 'GET',
      url: "https://api.lookatapp.co/pending/deposit/27121998"
    })
    .then(function successCallback(response) {
      $scope.placeDeposits = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //On Click place deposit
  //*
  $scope.checkPlaceBankAccount = function(id, total){
    $scope.showPlaceBankAccount = true;
    $scope.toDeposit = total;
    $scope.getPlaceInfo(id);
    $scope.startLoading();
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/hub/bankAccount?uuid='+id
    })
    .then(function successCallback(response) {
      console.log(response.data.data);
      $scope.bankAccount = response.data.data;
      $scope.stopLoading();
    }, function errorCallback(response) {
      $scope.stopLoading();
    });
  }

  //*
  //Retrieve Info driver
  //
  $scope.getDriverInfo = function(id) {
    console.log(id)
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/privilege/driver?id=' + id
    })
    .then(function successCallback(response) {
      console.log('fuck', response.data)
      $scope.driver = response.data.data.User;
      $scope.modalInfo.image = response.data.data.User.photo;
      $scope.modalInfo.title = 'Depositar a ' + $scope.driver.name;
      $scope.modalInfo.description = 'Repartidor lookatdelivery'
    }, function errorCallback(response) {
    });
  }


  //*
  //Prepare God Deposit
  //*
  $scope.prepareDeposits = function(){
    $scope.startLoading();
    $http({
      method: 'GET',
      url: "https://api.lookatdelivery.com/privilege/cash"
    })
    .then(function successCallback(response) {
      $scope.Deposits = response.data.data;
      $scope.stopLoading();
    }, function errorCallback(response) {
    });
  }

  //*
  //Fetch One Bank Account
  //*
  $scope.checkBankAccount = function(id, amount){
    $scope.showBankAccount = true;
    $scope.getDriverInfo(id);
    $scope.toDeposit = amount
    $scope.startLoading();
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/privilege/bankAccount?idDriver='+id
    })
    .then(function successCallback(response) {
      $scope.bankAccount = response.data.data;
      $scope.stopLoading();
    }, function errorCallback(response) {
      $scope.stopLoading();
    });
  }

  //*
  //Post Place Deposit
  //*
  $scope.postPlaceDeposit = function(id){
    $scope.startLoading();
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/hub/deposit?idPlace='+id+'&week='+$scope.weekYear
    })
    .then(function successCallback(response) {
      $scope.showPlaceBankAccount = false;
      $scope.fetchPendingPlaces();
      $scope.stopLoading();
      alert('PAGADO');
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('ERROR');
    });
  }

  //*
  //Post One God Deposit
  //*
  $scope.postDeposit = function(id){
    $scope.startLoading();
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/deposit?id='+id
    })
    .then(function successCallback(response) {
      $scope.showBankAccount = false;
      $scope.prepareDeposits();
      $scope.stopLoading();
      alert('PAGADO');
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('ERROR');
    });
  }

  //Wrap Up
  $scope.prepareDeposits();
  $scope.fetchPendingPlaces();
})
