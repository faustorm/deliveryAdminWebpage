angular.module('adminWebpage.places', ['adminWebpage.modal','adminWebpage.couponmodal']).controller('PlacesController', function( $scope, $http, $window ) {
  $scope.Places = [];
  $scope.ActualPlace = {};
  $scope.ActualAdmin = {
    User: {}
  }
  $scope.deposit = {};
  $scope.modalInfo = {
  };
  $scope.pendingPlaces = [];
  var idZone = window.localStorage["actualId"];

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
  //Prepare Places
  //*
  $scope.fetchPlaces = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/place'
    })
    .then(function successCallback(response) {
      $scope.Places = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Pending of Activate Places
  //*
  $scope.fetchUnactivePlaces = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/hub/place/unactive'
    })
    .then(function successCallback(response) {
      console.log(response.data.data);
      $scope.pendingPlaces = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Activate One Place
  //*
  $scope.submitActive = function() {
    console.log($scope.activatePlace);
    data = {
      idPlace: $scope.activatePlace.idPlace
    }
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/hub/place/unactive',
      data: data
    })
    .then(function successCallback(response) {
      $scope.doRefresh();
      alert('LISTO. Haz registrado este pago exitosamente.')
      $scope.activatePlace = {};
      $scope.addingActive = false;
    }, function errorCallback(response) {
    });
  }

  //*
  //Prepare Activate
  //*
  $scope.activeForm = function(index){
    $scope.addingActive = true;
    $scope.modalInfo = {
      title: 'Activar lúgar'
    }
    $scope.activatePlace = $scope.pendingPlaces[index];
  }

  //*
  //Fetch one zone
  //*
  $scope.fetchZone = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/zone/specific?id='+idZone
    })
    .then(function successCallback(response) {
      $scope.zone = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Fetch Place Address
  //*
  $scope.fetchAddress = function(idPlace) {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/address/' + idPlace
    })
    .then(function successCallback(response) {
      console.log(response.data.data[0]);
      $scope.addressPlace = response.data.data[0];
    }, function errorCallback(response) {
    });
  }

  //*
  //Fetch Place Admins
  //*
  $scope.fetchAdmins = function(idPlace) {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/hub/admin/place?idPlace=' + idPlace
    })
    .then(function successCallback(response) {
      console.log(response)
      $scope.admins = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Prepare Driver
  //*
  $scope.prepareRegisterDeposit = function(){
    $scope.addingDeposit = true;
    $scope.modalInfo = {
      title: 'Registrar deposito hecho en banco'
    }
    $scope.fetchStandardPlaces();
    $scope.fetchFullPlaces();
  }

  //*
  //Prepare Admin
  //*
  $scope.prepareAddAdmin = function(){
    $scope.addingAdmin = true;
    $scope.modalInfo = {
      title: 'Agregar administrador a ' + $scope.ActualPlace.place
    }
  }

  //*
  //Post Admin
  //*
  $scope.submitAdmin = function(email) {
    var dataInfo = {
      idPlace: $scope.ActualPlace.id,
      email: email
    }
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/hub/admin',
      data: dataInfo
    })
    .then(function successCallback(response) {
      alert('LISTO. Haz registrado este administrador exitosamente.');
      $scope.addingAdmin = false;
      $scope.fetchAdmins($scope.ActualPlace.id);
    }, function errorCallback(response) {
      alert('No hemos podido, asegurate de que el correo esta bien escrito.');
    });
  }

  //*
  //Remove Admin
  //*
  $scope.removeAdmin = function(idAdmin) {
    $http({
      method: 'DELETE',
      url: 'https://api.lookatdelivery.com/hub/admin?idAdmin='+ idAdmin
    })
    .then(function successCallback(response) {
      alert('LISTO. Haz quitado este administrador exitosamente.');
      $scope.fetchAdmins($scope.ActualPlace.id);
    }, function errorCallback(response) {
      alert('No hemos podido.');
    });
  }

  $scope.changedValue = function(place) {
    selection = JSON.parse(place);
    if(selection.subscription == 'fullService') {
      $scope.deposit.uuid = selection.deliveryuuid;
    } else {
      $scope.deposit.uuid = selection.id;
    }
    $scope.deposit.type = selection.subscription;
  }

  $scope.submitDeposit = function() {
    console.log($scope.deposit);
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/external/deposit',
      data: $scope.deposit
    })
    .then(function successCallback(response) {
      $scope.doRefresh();
      alert('LISTO. Haz registrado este pago exitosamente.')
      $scope.deposit = {};
      $scope.addingDeposit = false;
    }, function errorCallback(response) {
    });
  }

  //*
  //Ftech bank info
  //*
  $scope.fetchBankInfo = function(uuid) {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/hub/bankAccount?uuid=' + uuid
    })
    .then(function successCallback(response) {
      console.log(response.data);
      $scope.bankAccount = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Ftech bank info
  //*
  $scope.fetchStandardPlaces = function() {
    $http({
      method: 'GET',
      url: ' https://api.lookatapp.co/hub/place/subscription?plan=standard'
    })
    .then(function successCallback(response) {
      $scope.standardPlaces = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Ftech bank info
  //*
  $scope.fetchFullPlaces = function() {
    $http({
      method: 'GET',
      url: ' https://api.lookatapp.co/hub/place/subscription?plan=fullService'
    })
    .then(function successCallback(response) {
      console.log(response.data.data)
      $scope.fullServicePlaces = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Prepare to analyze Places
  //*
  $scope.preparePlace = function(index) {
    $scope.ActualPlace = $scope.Places[index];
    $scope.ActualAdmin.User.photo = $scope.ActualPlace.logo;
    $scope.ActualAdmin.User.name = $scope.Places[index].place;
    $scope.fetchAddress($scope.ActualPlace.id);
    $scope.fetchAdmins($scope.ActualPlace.id)
    $scope.fetchBankInfo($scope.ActualPlace.id);
    $scope.analyzingPlace = true;
  }


  //Wrap up
  $scope.doRefresh = function() {
    $scope.fetchPlaces();
    $scope.fetchZone();
    $scope.fetchUnactivePlaces();
  }

  $scope.doRefresh();
})
