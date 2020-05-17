angular.module('adminWebpage.vehicles', ['adminWebpage.couponmodal']).controller('VehicleController', function( $scope, $http, $window ) {
  var specificVehicle = 0;
  $scope.zone = {
    name: window.localStorage["zoneName"]
  }
  $scope.modalInfo = {
    image: 'img/deliveryCover.png'
  };

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
  $scope.prepareAddVehicle = function() {
    $scope.addingVehicle = true;
    $scope.modalInfo.title = 'Agregar Vehiculo';
    $scope.modalInfo.description = 'Los vehiculos que agregues, estaran a la disposición de los choferes en ' + $scope.zone.name;
  }


  //*
  //Post Vehicle
  //*
  $scope.uploadVehicle = function(vehicle){
    $scope.startLoading();
    var user_request = {
      type: vehicle.type,
      model: vehicle.model,
      color: vehicle.color,
      plates: vehicle.plates,
      year: vehicle.year,
      idZone: window.localStorage["actualId"]
    }
    console.log(user_request);
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/vehicle',
      data: user_request
    })
    .then(function successCallback(response) {
      $scope.addingVehicle = false
      $scope.stopLoading();
      alert('Haz agregado el vehiculo exitosamente.');
      $scope.fetchVehicles();
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Error, Ponte en contacto con un administrador si el problema persiste.');
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
      console.log(response.data.data);
      $scope.vehicles = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Prepare Product
  //*
  $scope.prepareEditVehicle = function(id){
    $scope.editingVehicle = true;
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/vehicle/one?id='+id
    })
    .then(function successCallback(response) {
      $scope.specificVehicle = response.data.data;
      specificVehicle = response.data.data.id;
      $scope.vehicle = response.data.data;
      $scope.modalInfo.title = response.data.data.model;
      $scope.modalInfo.description = response.data.data.type;
      $scope.fetchVehicles();
    }, function errorCallback(response) {
    });
  }


  //*
  //PUT Product
  //*
  $scope.editVehicle = function(vehicle){
    $scope.startLoading();
    var user_request = {
      type: vehicle.type,
      model: vehicle.model,
      color: vehicle.color,
      plates: vehicle.plates,
      year: vehicle.year,
    }
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/vehicle/edit?id=' + specificVehicle,
      data: user_request
    })
    .then(function successCallback(response) {
      $scope.editingVehicle = false;
      $scope.stopLoading();
      alert('Haz editado el vehiculo exitosamente.');
      $scope.fetchVehicles();
    }, function errorCallback(response) {
      $scope.editingVehicle = false;
      $scope.stopLoading();
      alert('error, intentalo de nuevo.')
    });
  }

  //Wrap Up
  $scope.fetchVehicles();
});
