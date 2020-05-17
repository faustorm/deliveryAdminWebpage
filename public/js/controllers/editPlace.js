angular.module('adminWebpage.editPlace', []).controller('EditPlaceController', function( $scope, $http, $window ) {
  $scope.intention = null;
  $scope.photoReady = false;
  $scope.edit;
  $scope.editingPlace = false;
  $scope.photoText;


  //*
  //Log Out
  //
  $scope.logOut = function() {
    localStorage.clear();
    window.location.href= ("/dashboard");
  }


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
  //Cropper
  //
  $scope.cropper = {};
  $scope.cropper.sourceImage = null;
  $scope.cropper.croppedImage   = null;
  $scope.bounds = {};
  $scope.bounds.left = 0;
  $scope.bounds.right = 0;
  $scope.bounds.top = 0;
  $scope.bounds.bottom = 0;
  $scope.cropped = 0;
  $scope.cropImg = function() {
    $scope.photoReady = true;
    $scope.cropped = 1;
    var canvas = document.getElementById("result_canvas");
    var ctx = canvas.getContext("2d");
    var image = new Image();
    image.onload = function() {
      ctx.drawImage(image, 0, 0);
    };
    image.src = $scope.cropper.croppedImage;
  }
  $scope.range = function(n) {
    return new Array(n);
  };

  //*
  //Select Editing
  //
  $scope.preparePhotoEdit = function(type){
    $scope.intention = type;
    $scope.editingPlace = false;
    if(type == 'logo') {
      $scope.photoText = 'de Logo'
    } else if(type == 'coverPicture') {
      $scope.photoText = 'de Portada'
    }
  }

  //*
  // Edit place
  //*
  $scope.preparePlaceEdit = function() {
    $scope.editingPlace = true;
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/place/profile?id='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.edit = response.data.data[0];
    }, function errorCallback(response) {
    });
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
    }, function errorCallback(response) {
    });
  }


  //*
  //Retrieve Info place
  //
  $scope.cancelPhoto = function() {
    $scope.cropper.sourceImage = null;
    $scope.cropper.croppedImage   = null;
    $scope.intention = null;
    $scope.photoReady = false;
    $scope.photoText = null;
  }


  //*
  //Upload One Photo
  //
  $scope.uploadPhoto = function() {
    $scope.startLoading();
    var fd = new FormData();
    var canvas = document.getElementById('result_canvas');
    canvas.toBlob(function(blob) {
      fd.append('file', blob);
      $http.defaults.headers.common.authorization = window.localStorage['lookAtToken']
      var request = {
        method: 'POST',
        url: 'https://api.lookatdelivery.com/place/image',
        data: fd,
        headers: {
          'Content-Type': undefined
        }
      };
      $http(request)
      .then(function successCallback(response) {
        promotion_request = {
          logo : response.data.data.path
        }
        $http({
          method: 'PUT',
          url: 'https://api.lookatdelivery.com/place/image/' + $scope.intention + '?id=' + window.localStorage["actualId"],
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          data: promotion_request
        })
        .then(function successCallback(response) {
          $scope.stopLoading();
          $scope.cancelPhoto();
          $scope.getPlaceInfo();
          alert('La foto ha sido cambiada exitosamente.');
        }, function errorCallback(response) {
          $scope.stopLoading();
          alert('No hemos podido, porque no lo intentas de nuevo.')
        });
      }, function errorCallback(response) {
        alert('Error, Intentalo de nuevo.')
      });
    }, 'image/jpeg', 0.8);
  }

  //*
  //Edit Place
  //**
  $scope.editPlace = function(edit){
    $scope.startLoading();
    place_request = {
      idCategory : $scope.edit.idCategory,
      idType : $scope.edit.idType,
      homeDelivery : $scope.edit.homeDelivery,
      pickUp : $scope.edit.pickUp,
      phoneNumber : $scope.edit.phoneNumber,
      reservation : $scope.edit.reservation,
      description : $scope.edit.description,
      branch : $scope.edit.branch,
      place : $scope.edit.place,
      parking : $scope.edit.parking,
      costAverage : $scope.edit.costAverage,
      payMethods : $scope.edit.payMethods,
      outdoor : $scope.edit.outdoor,
      speciality : $scope.edit.speciality,
      prePay : $scope.edit.prePay,
      radius : $scope.edit.radius,
      minimumOrder : $scope.edit.minimumOrder,
      shipping : $scope.edit.shipping
    }
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/place/manage?id=' + window.localStorage["actualId"],
      headers: {"Content-Type": "application/json;charset=UTF-8"},
      data: place_request
    })
    .then(function successCallback(response) {
      $scope.stopLoading();
      alert('Haz editado este lugar exitosamente.');
      $scope.getPlaceInfo();
      window.location.href= ("https://manage.lookatapp.co/dashboard");
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Error');
    });
  }


  //*
  //Prepare Info edit
  //*
  $scope.prepareForm = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/category'
    })
    .then(function successCallback(response) {
      $scope.Categories = response.data.data;
    }, function errorCallback(response) {
    });
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/type'
    })
    .then(function successCallback(response) {
      $scope.Types = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Wrap Up
  //
  $scope.getPlaceInfo();
  $scope.prepareForm();
})
