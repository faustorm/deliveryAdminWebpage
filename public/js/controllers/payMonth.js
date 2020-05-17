angular.module('adminWebpage.payMonth', ['adminWebpage.addCardModal']).controller('PayMonthController', function( $scope, $http, $window, $rootScope ) {
  $scope.payingPlace = false;
  $scope.place = {};
  $scope.payingFirstPlace = false;

  //Loaders
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
  //Prepare to pay place
  //*
  $scope.preparePayPlace = function () {
    $scope.payingPlace = true;
  }

  //*
  //Prepare to pay First place
  //*
  $scope.preparePayFirstPlace = function () {
    $scope.payingFirstPlace = true;
  }

  //*
  //Prepare to add Card
  //*
  $scope.prepareAddCard = function () {
    $rootScope.addingCard = true;
  }


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

  //*
  //Pay place
  //*
  $scope.payPlace = function(pay){
    $scope.startLoading();
    $scope.date = moment($scope.place.expirationDate, "YYYY/MM/DD").add(pay.months, 'M').format("YYYY/MM/DD");
    $scope.amount = pay.months * 499;
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/user'
    })
    .then(function successCallback(response) {
      $scope.User = response.data.data;
      var user_request = {
        token : pay.card,
        months : pay.months,
        description : 'Cobrando por $' + $scope.amount + ' el servicio de Reservaciones, pedidos para llevar y a domicilio ilimitados durante ' + pay.months + ' meses mas.',
        customer : {
          name : $scope.User[0].name,
          email : $scope.User[0].email
        },
        idPlace : window.localStorage["actualId"],
        expirationDate : $scope.date
      }
      $http({
        method: 'POST',
        url: 'https://api.lookatdelivery.com/charge',
        data: user_request
      })
      .then(function successCallback(response) {
        $scope.stopLoading();
        $scope.getPlaceInfo();
        $scope.payingPlace = false;
        alert('Haz pagado la mensualidad exitosamente.');
      }, function errorCallback(response) {
        $scope.stopLoading();
        alert('No hemos podido, si el problema persiste porfavor ponte en contacto con nosotros');
      });
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('No hemos podido agregar este pago, si el problema persiste ponte en contacto con nosotros.');
    });
  }

  //*
  //Pay First Month
  //*
  $scope.payFirstPlace = function(pay){
   $scope.startLoading();
   var sessionId = OpenPay.deviceData.setup();
   $scope.date = moment().add(3, 'M').format("YYYY/MM/DD");
   $scope.amount = 499
   $http({
    method: 'GET',
    url: 'https://api.lookatdelivery.com/user'
   })
    .then(function successCallback(response) {
      $scope.User = response.data.data;
        var user_request = {
          token : pay.card,
          months : 1,
          description : 'Cobrando por $' + '499' + ' el servicio de Reservaciones, pedidos para llevar y a domicilio ilimitados durante 3 meses al precio de uno.',
          sessionId : sessionId,
          customer : {
            name : $scope.User[0].name,
            email : $scope.User[0].email
          },
          idPlace : window.localStorage["actualId"],
          expirationDate : $scope.date
        }
        $http({
          method: 'POST',
          url: 'https://api.lookatdelivery.com/charge',
          data: user_request
        })
        .then(function successCallback(response) {
          $scope.stopLoading();
          window.location.href= ("https://manage.lookatapp.co/dashboard");
        }, function errorCallback(response) {
          $scope.stopLoading();
          alert('Error, Intentalo de Nuevo');
        });
    }, function errorCallback(response) {
      $scope.stopLoading();
    });
  }


  $scope.getPlaceInfo();
  $scope.fetchCards();
})
