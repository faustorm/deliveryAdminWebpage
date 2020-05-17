angular.module('adminWebpage.users', ['adminWebpage.modal','adminWebpage.couponmodal']).controller('UsersController', function( $scope, $http, $window ) {
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
  //Pending of Activate Places
  //*
  $scope.fetchUnactiveUsers = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/hub/users/unactive'
    })
    .then(function successCallback(response) {
      $scope.pendingUsers = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Activate One Place
  //*
  $scope.submitActive = function() {
    console.log($scope.activateUser);
    data = {
      idUser: $scope.activateUser.idUser
    }
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/hub/user/unactive',
      data: data
    })
    .then(function successCallback(response) {
      console.log(data);
      $scope.doRefresh();
      alert('LISTO. Haz registrado este pago exitosamente.')
      $scope.activateUser = {};
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
      title: 'Activar Usuario'
    }
    $scope.activateUser = $scope.pendingUsers[index];
  }

  //Wrap up
  $scope.doRefresh = function() {
    $scope.fetchUnactiveUsers();
  }

  $scope.doRefresh();
})
