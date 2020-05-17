angular.module('adminWebpage.promotions', ['adminWebpage.placeheader']).controller('PromotionsController', function( $scope, $http, $window, FileUploader ) {
  $scope.modalInfo = {}
  $scope.addingMenu = false;
  $scope.ActualAdmin = {
    User: {}
  };
  //*
  //Loaders
  //
  $scope.startLoading = function(){
    $('.spinnerDiv').show();
  };
  $scope.stopLoading = function(){
    $('.spinnerDiv').hide();
  };

  //*
  //Prepare add Offer
  //*
  $scope.prepareAddCode = function() {
    $scope.addingOffer = true;
    $scope.ActualAdmin.User.name = 'Agregar Oferta';
  }

  //*
  //Post Offer
  //*
  $scope.uploadOffer = function(newOffer){
    $scope.startLoading();
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/hub/code',
      data: newOffer
    })
    .then(function successCallback(response) {
      $scope.stopLoading();
      $scope.addingOffer = false;
      alert('Haz agregado la promoción exitosamente.');
      $scope.doRefresh();
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Error, Ponte en contacto con nosotros si el problema persiste.');
    });
  }

  //*
  //Retrieve Product Discounts
  //
  $scope.fetchActualProductDiscounts = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/hub/codediscounts?type=product'
    })
    .then(function successCallback(response) {
      $scope.productDiscounts = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Retrieve Code Discounts
  //
  $scope.fetchActualCodeDiscounts = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatapp.co/hub/codediscounts?type=codes'
    })
    .then(function successCallback(response) {
      $scope.codeDiscounts = response.data.data;
    }, function errorCallback(response) {
    });
  }

  $scope.doRefresh = function () {
    $scope.fetchActualProductDiscounts();
    $scope.fetchActualCodeDiscounts();
  }
  $scope.doRefresh();
})
