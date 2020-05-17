angular.module('adminWebpage.receipts', ['adminWebpage.couponmodal','adminWebpage.placeheader']).controller('ReceiptsController', function( $scope, $http, $window ) {
  $scope.modalInfo = {};
  $scope.bankAccount = {};
  $scope.editingBankAccount = false;

  $scope.startLoading = function(){
    $('.spinnerDiv').show();
  };
  $scope.stopLoading = function(){
    $('.spinnerDiv').hide();
  };

  //*
  //Retrieve Info place
  //
  $scope.getPlaceInfo = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/place/profile?id='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.place = response.data.data[0];
      $scope.modalInfo.image = response.data.data[0].coverPicture;
    }, function errorCallback(response) {
    });
  }


  //
  //Fetch Deposits
  //*
  $scope.fetchDeposits = function(){
    $http({
      method: 'GET',
      url: "https://api.lookatdelivery.com/deposit?id=" + window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.Deposits = response.data.data;
    }, function errorCallback(response) {
    });
  }


  //*
  //Fetch Charges
  //*
  $scope.fetchPendingCharges = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/credit/place?id='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      console.log(response);
      $scope.Charges = response.data.data;
    }, function errorCallback(response) {
    });
  }


  //*
  //Fetch Specific Order
  //*
  $scope.getSpecificOrder = function(placeId, orderId){
    $scope.showOrderDetailModal = true;
    $scope.startLoading();
    $scope.total = 0;
    console.log("https://api.lookatdelivery.com/orderZoom?idPlace=" + placeId + "&&id=" + orderId)
    $http({
      method: 'GET',
      url: "https://api.lookatdelivery.com/orderZoom?idPlace=" + placeId + "&&id=" + orderId
    })
    .then(function successCallback(response) {
      $scope.orderZoom = response.data.data[0];
    }, function errorCallback(response) {
    });

    $http({
      method: 'GET',
      url: "https://api.lookatdelivery.com/order/detail?idOrder=" + orderId
    })
    .then(function successCallback(response) {
      $scope.products = response.data.data[0].products;
      $scope.guarnitions = response.data.data[0].guarnitions;
      console.log($scope.products);
      for (var i = 0; i < $scope.products.length; i++) {
        $scope.total += Number(response.data.data[0].products[i].amount)
      }
    }, function errorCallback(response) {
    });

    $scope.googleMaps = function(lat, lng) {
      var options = {location: 'yes',clearcache: 'yes',toolbar: 'yes'}
      window.open("https://maps.google.com/maps?q="+ lat+","+lng, '_blank', options)
      .then(function(event) {
      })
      .catch(function(event) {
        window.alert('No se pudo cargar la página', 'Error.', 'Ok').then(function() {});
      });
    }

    $scope.stopLoading();
  }


  //*
  //Prepare Fetch Charges
  //*
  $scope.prepareFetchCharges = function() {
    $scope.seeingPendingCharges = true;
    $scope.modalInfo.title = 'Cargos pendientes';
    $scope.modalInfo.description = 'Depositaremos en el transcurso de esta semana los siguientes cargos de ordenes con tarjetas de crédito';
    $scope.fetchPendingCharges();
  }


  //
  //Fetch Pending Deposits
  //*
  $scope.fetchPendingDeposits = function(){
    $http({
      method: 'GET',
      url: "https://api.lookatdelivery.com/pending/place/deposit?idPlace=" + window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.pendingAmount = response.data.data[0].pending;
    }, function errorCallback(response) {
    });
  }


  //*
  //Fetch Bank account
  //*
  $scope.fetchBankAccount = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/bankAccount?idPlace=' + window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.bankAccount = response.data.data;
      console.log(response.data.data);
    }, function errorCallback(response) {
    });
  }

  //*
  //Prepare Add Bank account
  //*
  $scope.prepareAddBankAccount = function() {
    $scope.addingBankAccount = true;
    $scope.modalInfo.title = 'Agregar cuenta bancaria';
    $scope.modalInfo.description = 'Depositaremos semanalmente los cobros que se hayan hecho con tarjeta hacia tu restaurante, sin ningun tipo de comisión.'
  }


  //*
  //Post Bank account
  //*
  $scope.postBankAccount = function(bankAccountData){
    $scope.startLoading();
      var user_request = {
      bussinessName : bankAccountData.bussinessName,
      RFC : bankAccountData.RFC,
      offices : bankAccountData.offices,
      bankName : bankAccountData.bankName,
      accountNumber : bankAccountData.accountNumber,
      clabeNumber : bankAccountData.clabeNumber
    }
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/bankAccount?id=' + window.localStorage["actualId"],
      data: user_request
    })
    .then(function successCallback(response) {
      $scope.addingBankAccount = false;
      $scope.fetchBankAccount();
      $scope.stopLoading();
      alert('Cuenta Bancaria agregada exitosamente.')
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Hubo un error, intentalo de nuevo.')
    });
  }


  //*
  //Prepare edit bank account
  //*
  $scope.prepareEditBankAccount = function() {
    $scope.editingBankAccount = true;
    $scope.modalInfo.title = 'Editar cuenta bancaria';
    $scope.modalInfo.description = 'Recuerda que depositaremos semanalmente los cobros que se hayan hecho con tarjeta hacia tu restaurante, sin ningun tipo de comisión.'
  }


  //*
  //Edit Bank account
  //*
  $scope.putBankAccount = function(){
    $scope.startLoading();
    var user_request = {
      bussinessName : $scope.bankAccount.bussinessName,
      RFC : $scope.bankAccount.RFC,
      offices : $scope.bankAccount.offices,
      bankName : $scope.bankAccount.bankName,
      accountNumber : $scope.bankAccount.accountNumber,
      clabeNumber : $scope.bankAccount.clabeNumber
    }
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/bankAccount?id='+window.localStorage["actualId"],
      data: user_request
    })
    .then(function successCallback(response) {
      $scope.editingBankAccount = false;
      $scope.fetchBankAccount();
      $scope.stopLoading();
      alert('Cuenta bancaria editada exitosamente.')
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Hubo un error, intentalo de nuevo.');
    });
  }

  $scope.fetchBankAccount();
  $scope.fetchDeposits();
  $scope.fetchPendingDeposits();
  $scope.getPlaceInfo();
});
