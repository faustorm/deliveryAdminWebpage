var app = angular.module('adminWebpage.index', ['angularMoment','angularFileUpload']);
//Factory Method to Check Token
app.factory('checkLogin', function($http, $location, $state) {
  return {
    injectToken: function() {
      $http.defaults.headers.common.authorization = window.localStorage['lookAtToken']
    },
  };
});
//Intercept Google API
app.factory('checkLoginInterceptor', ['$log', function($log) {
    return {
      request: function(config) {
        if(!(config.url.indexOf('https://maps.googleapis.com') > -1)) {
          config.headers['authorization'] = window.localStorage['lookAtToken'];
        }
        return config;
      }
    }
}]);
//Method To Intercept
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('checkLoginInterceptor');
}]);

//ConfirmController
app.controller('confirmAccountCtrl', function( $scope, $http, $location, $stateParams, checkLogin, FileUploader) {
  $http({
    method: 'PUT',
    url: 'https://api.lookatdelivery.com/confirmation/user?id='+$stateParams.id
  })
  .then(function successCallback(response) {
    $scope.verified = true;
    alert('Te haz suscrito a lookat! comienza a explorar');
  }, function errorCallback(response) {
  });
});

//Coupon Controller
app.controller('changePasswordController', function( $scope, $http, $location, $stateParams, checkLogin) {
  $scope.password;
  $scope.confirmPassword;
  $scope.resetPassword = function(){
    var user_request = {
      hashToken: $stateParams.hashToken,
      token: $stateParams.token,
      password: $scope.password
    }
    if($scope.password == $scope.confirmPassword){
      console.log(user_request)
      //Request
      $http({
        method: 'PUT',
        url: 'https://api.lookatdelivery.com/confirm/password/reset',
        data: user_request
      })
      .then(function successCallback(response) {
        alert('Haz restaurado tu contraseña');
      }, function errorCallback(response) {
        alert('Ha expirado la solicitud');
      });
    }else{
      alert('Las contraseñas no coinciden');
    }
  }
});

//Unregistered Controller
app.controller('unregisteredController', function( $scope, $http, $location, $stateParams, checkLogin, $stateParams) {
  $scope.userData = {
    email : $stateParams.email,
    name : $stateParams.name,
    idReservation: $stateParams.idReservation
  }
  $scope.signUp = function(user){
    console.log(user)
    reservationFormatted = moment(user.birthday).format("YYYY-MM-DD");
    if(user.confirmPassword == user.password){
      var user_request = {
        name: user.name,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        photo: "img/undefinedUser.png",
        birthday: reservationFormatted,
        idReservation: $stateParams.idReservation
      }
      $http({
        method: 'POST',
        url: 'https://api.lookatdelivery.com/unregistered/user',
        data: user_request
      })
      .then(function successCallback(response) {
        alert('Felicidades! Te haz suscrito a lookat delivery.')
        window.location.href= ("www.lookatapp.co");
      }, function errorCallback(response) {
        alert('error');
      });
    }else{
      alert("Las contraseñas no coinciden.")
    }
  }
});
