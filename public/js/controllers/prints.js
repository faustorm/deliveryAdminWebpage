angular.module('adminWebpage.prints', []).controller('PrintsController', function( $scope, $http, $window, $rootScope ) {
  $scope.payingPrints = false;

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
  //Retrieve Cards
  //*
  $scope.fetchCards = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/card'
    })
    .then(function successCallback(response) {
      $scope.Cards = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Retrieve Info place
  //*
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

  //*
  //Retrieve Print Info
  //*
  $scope.fetchPrints = function() {
    $http({
      method: 'GET',
      url: "https://api.lookatdelivery.com/print/place?id=" +window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.prints = response.data.data;
      console.log(response.data.data);
    }, function errorCallback(response) {
    });
  }

  //*
  //Pay prints
  //
  $scope.payPrint = function(print){
    $scope.startLoading();
    $scope.amount = 0;
    console.log('entered')
    $http({
       method: 'GET',
       url: 'https://api.lookatdelivery.com/user'
    })
    .then(function successCallback(response) {
      $scope.User = response.data.data;
      var user_request = {
        token : print.card,
        logs : print.logs,
        customer : {
          name : $scope.User[0].name,
          email : $scope.User[0].email
        },
        idPlace : window.localStorage["actualId"]
      }
      $http({
        method: 'POST',
        url: 'https://api.lookatdelivery.com/charge/print',
        data: user_request
      })
      .then(function successCallback(response) {
        $scope.stopLoading();
        $scope.payingPrints = false;
        $scope.fetchPrints();
        alert('Haz pagado mas recomendaciones del dia exitosamente.')
      }, function errorCallback(response) {
        $scope.stopLoading();
        console.log(response);
        alert('Hubo un error, si el problema persiste ponte en contacto con nosotros.');
      });
     }, function errorCallback(response) {
       $scope.stopLoading();
       alert('Hubo un error con tu autenticación y los permisos, si el problema persiste ponte en contacto con nosotros.')
     });
  }

  //*
  //Prepare to pay prints
  //*
  $scope.preparePayPrints = function () {
    $scope.payingPrints = true;
  }

  //*
  //Prepare to add Card
  //*
  $scope.prepareAddCard = function () {
    $rootScope.addingCard = true;
  }


  $scope.fetchCards();
  $scope.getPlaceInfo();
  $scope.fetchPrints();
})
