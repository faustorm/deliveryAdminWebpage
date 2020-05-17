angular.module('adminWebpage.drivers', ['adminWebpage.couponmodal']).controller('DriverController', function( $scope, $http, $window ) {
  var analyzingDriver = 0;
  $scope.zone = {
    name: window.localStorage["zoneName"]
  }
  $scope.modalInfo = {
    image: 'img/deliveryCover.png'
  };
  $scope.drivers = [];

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
  //Submit a product
  //*
  $scope.prepareAddDriver = function() {
    $scope.addingDriver = true;
    $scope.modalInfo.title = 'Agregar Conductor';
    $scope.modalInfo.description = 'Los conductores que agregues, estaran repartiendo paquetes en ' + $scope.zone.name;
    $scope.fetchVehicles();
  }


  //*
  //Post Product
  //*
  $scope.uploadDriver = function(driver){
    $scope.fetchVehicles();
    $scope.startLoading();
    var user_request = {
      idVehicle: driver.idVehicle,
      email: driver.email,
      idZone: window.localStorage["actualId"]
    }
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/driver?idZone=' + window.localStorage["actualId"],
      data: user_request
    })
    .then(function successCallback(response) {
      $scope.addingDriver = false;
      $scope.stopLoading();
      alert('Haz agregado el conductor exitosamente.');
      $scope.fetchDrivers();

    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Error, Ponte en contacto con un administrador si el problema persiste. El conductor ya debe haber estado de alta en la plataforma.');
    });
  }

  //*
  //Retrieve Vehicles
  //
  $scope.fetchVehicles = function(){
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/vehicle/zone?id='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.vehicles = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Retrieve Drivers
  //
  $scope.fetchDrivers = function(){
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/driver/zone?id='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.drivers = response.data.data;
    }, function errorCallback(response) {
    });
  }


  //*
  //Prepare Driver
  //*
  $scope.prepareEditDriver = function(id){
    $scope.editingDriver = true;
    analyzingDriver = id;
    $scope.fetchVehicles();
  }


  //*
  //PUT Product
  //*
  $scope.editDriverVehicle = function(vehicle){
    $scope.startLoading();
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/driver/vehicle?id=' + analyzingDriver + '&&idVehicle=' + vehicle.id + '&&idZone='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.editingDriver = false;
      $scope.stopLoading();
      alert('Haz editado el vehiculo del conductor exitosamente.');
      $scope.fetchDrivers();
    }, function errorCallback(response) {
      $scope.editingDriver = false;
      $scope.stopLoading();
      alert('error, intentalo de nuevo.')
    });
  }

  $scope.checkDriver = function(position) {
    $scope.analyzingDriver = true;
    $scope.analyzerDriver = $scope.drivers[position];
    $scope.ActualAdmin = $scope.drivers[position];
  }

  $scope.prepareSetPassword = function() {
    $scope.settingPassword = true;
  }

  $scope.setPassword = function(info) {
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/hub/password/reset',
      data: info
    })
    .then(function successCallback(response) {
      alert('Haz editado la contraseña de este conductor exitosamente.');
      $scope.settingPassword = false;
    }, function errorCallback(response) {
      alert('No hemos podido en este momento.');
    });
  }

  //Wrap Up
  $scope.fetchDrivers();
});
