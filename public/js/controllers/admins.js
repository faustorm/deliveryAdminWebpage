angular.module('adminWebpage.admins', ['adminWebpage.modal','adminWebpage.couponmodal']).controller('AdminsController', function( $scope, $http, $window ) {
  $scope.Admins = [];
  $scope.ActualAdmin = {};
  $scope.modalInfo = {
    image: 'img/deliveryCover.png'
  };
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
  //Prepare Admin
  //*
  $scope.fetchAdmins = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/admin/zone?id='+idZone
    })
    .then(function successCallback(response) {
      $scope.Admins = response.data.data;
    }, function errorCallback(response) {
    });
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
      console.log(response);
      $scope.zone = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Prepare Add Admin
  //*
  $scope.prepareAddAdmin = function() {
    $scope.modalInfo.title = 'Agregar Administrador'
    $scope.modalInfo.description = 'Para agregar un administrador, es necesario que primero se de de alta dentro de la plataforma creando su cuenta'
    $scope.addingAdmin = true;
  }

  //*
  //Prepare to analyze Admin
  //*
  $scope.prepareAdmin = function(id) {
    for(var i = 0; i < $scope.Admins.length; i++) {
      if(id == $scope.Admins[i].id) {
        $scope.ActualAdmin = $scope.Admins[i];
        $scope.checkingAdmin = true;
      }
    }
  }

  //*
  //Add One Admin
  //
  $scope.postAdmin = function(email){
    $scope.startLoading();
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/admin/add?id=' + idZone + '&email=' + email.email,
      headers: {"Content-Type": "application/json;charset=UTF-8"}
    })
    .then(function successCallback(response) {
      alert('Haz agregado este administrador exitosamente.');
      $scope.addingAdmin = false;
      $scope.stopLoading();
      $scope.fetchAdmins();
      $scope.ActualAdmin = {};
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Error, primero el usuario debe registrarse en lookat, verifica que el correo este bien escrito.')
    });
  }


  //*
  //Delete Admins
  //
  $scope.deleteAdmin = function(email){
    $scope.startLoading();
    $http({
      method: 'DELETE',
      url: 'https://api.lookatdelivery.com/admin/delete?id=' + idZone + '&email=' + email,
      headers: {"Content-Type": "application/json;charset=UTF-8"}
    })
    .then(function successCallback(response) {
      $scope.stopLoading();
      alert('Listo. Haz eliminado este administrador exitosamente.');
      $scope.checkingAdmin = false;
      $scope.fetchAdmins();
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('No hemos podido, si el problema persiste ponte en contacto con nosotros.')
    });
  }

  //Wrap up
  $scope.fetchAdmins();
  $scope.fetchZone();
})
