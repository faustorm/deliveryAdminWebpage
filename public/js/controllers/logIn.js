angular.module('adminWebpage.logIn', ['adminWebpage.services','adminWebpage.couponmodal']).controller('LogInController', function( $scope, $http, $window, $rootScope ) {
  $scope.modalInfo = {};

  //*
  //Show Sign Up
  //*
  $scope.showSignUp = function() {
    $scope.modalInfo.image = 'img/deliveryCover.png';
    $scope.modalInfo.title = 'Unete al equipo';
    $scope.modalInfo.description = 'En lookat nos preocupemos porque siempre haya demanda, date de alta en este sitio y analizaremos que tan buena opción somos para ti y generaremos un plan de atención especializado.';
    $scope.showSignUpModal = true;
  }



  //*
  //Verify User Log-In
  //*
  $scope.verifyUser = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/user'
    })
    .then(function successCallback(response) {
      window.location.href= ("/dashboard");
    }, function errorCallback(response) {
    });
  }

  //*
  //User Sign Up
  //*
  $scope.signUp = function(user){
    if(user.confirmPassword == user.password){
      var user_request = {
        name: user.name,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        rfc: user.rfc,
        photo: "img/undefinedUser.png"
      }
      $http({
        method: 'POST',
        url: 'https://api.lookatdelivery.com/user',
        data: user_request
      })
      .then(function successCallback(response) {
        alert('Felicidades! Hemos recibido tu solicitud, en poco tiempo un asesor se pondra en contacto contigo.')
        window.location.reload();
      }, function errorCallback(response) {
        alert('No hemos podido, si el problema persiste ponte en contacto con nosotros.');
      });
    }else{
      alert("Las contraseñas no coinciden.")
    }
  }

  //*
  //Post Log-In
  //*
  $scope.logIn = function(user){
    var user_request = {
      email: user.email,
      password: user.password
    }
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/user/login',
      data: user_request
    })
    .then(function successCallback(response) {
      window.localStorage["lookAtToken"] = response.data.data.token;
      $scope.token = window.localStorage["lookAtToken"];
      window.location.href= ("/dashboard");
    }, function errorCallback(response) {
      alert('Error, Intentalo de nuevo y verifica tu contraseña.')
    });
  }

  $scope.verifyUser();
})
