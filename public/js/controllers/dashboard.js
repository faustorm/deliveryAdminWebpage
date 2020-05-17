angular.module('adminWebpage.dashboard', ['adminWebpage.seriousModal','adminWebpage.couponmodal']).controller('DashboardController', function( $scope, $http, $window, $interval, $timeout ) {
  var zoneId = window.localStorage["actualId"];
  var zoneName = window.localStorage["zoneName"];
  $scope.zone = {};
  $scope.OnCourseTrips = [];
  $scope.modalInfo = {
    image: 'img/deliveryCover.png'
  };
  $scope.mainLoan = {}

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
  //Submit a loan
  //*
  $scope.AddLoanModal = function() {
    $scope.addingLoan = true;
    $scope.modalInfo.title = 'Generar prestamo';
    $scope.modalInfo.description = 'Esto es solo para registrarlo en nuestro sistema, debes generar el traspaso/deposito real a través de TicketWallet'
  }

  //*
  //Analyze Loan request
  //*
  $scope.AnalyzeLoanModal = function(loan, idDriver) {
    $scope.analyzingLoan = true;
    $scope.mainLoan = loan
    $scope.modalInfo.title = 'Aprobar Deposito';
    $scope.modalInfo.description = 'Esto es solo para registrarlo en nuestro sistema, debes generar el traspaso/deposito real a través de TicketWallet';
    $scope.fetchLoanHistory(idDriver);
  }

  //*
  //Send loan
  //*
  $scope.uploadLoan = function(loan) {
    $scope.startLoading();
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/loan/admin',
      data: loan
    })
    .then(function successCallback(response) {
      $scope.addingLoan = false;
      $scope.stopLoading();
      alert('Haz agregado el prestamo exitosamente.');
      $scope.fetchPendingLoans();

    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Error, Ponte en contacto con un administrador si el problema persiste. El conductor ya debe haber estado de alta en la plataforma.');
    });
  }

  $scope.approveLoan = function(status) {
    console.log($scope.mainLoan);
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/loan/approve?status=' + status + '&&idTrip=' + $scope.mainLoan.idTrip
    })
    .then(function successCallback(response) {
      $scope.analyzingLoan = false;
      $scope.stopLoading();
      alert('OKAY');
      $scope.fetchPendingLoans();
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Error, Ponte en contacto con un administrador si el problema persiste. El conductor ya debe haber estado de alta en la plataforma.');
    });
  }
  //*
  //Change Zone Inspector
  //*
  $scope.changeZone = function(zoneId,zoneName){
    window.localStorage["actualId"] = zoneId;
    window.localStorage["zoneName"] = zoneName;
    zoneId = zoneId;
    zoneName = zoneName
    $scope.zone = {
      name: zoneName,
      id: zoneId
    }
    $scope.doRefresh();
  }

  //*
  //Go To One Places
  //*
  $scope.leavePage = function(link) {
    $scope.showWelcomeModal = false;
    window.location.href= (link);
  }


  //*
  //Check Admins
  //*
  $http({
    method: 'GET',
    url: 'https://api.lookatdelivery.com/admin/user'
  })
  .then(function successCallback(response) {
    $scope.Zones = response.data.data;
    if($scope.Zones.length == 0) {
      $scope.shoWelcome();
    } else{
      if(response.data.status == 401){
        window.location.href= ("/index");
      }
      if (!window.localStorage["actualId"]){
        window.localStorage["actualId"] = response.data.data[0].idZone;
        $scope.changeZone($scope.Zones[0].Zone.id,$scope.Zones[0].Zone.name);
      } else {
        $scope.changeZone($scope.Zones[0].Zone.id,$scope.Zones[0].Zone.name);
      }
    }
  }, function errorCallback(response) {
    window.location.href= ("/index");
  });

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
  //Retrieve Drivers
  //
  $scope.fetchLoanHistory = function(idDriver){
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/loan/admin/history?idDriver='+idDriver
    })
    .then(function successCallback(response) {
      $scope.LoanHistory = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //FetchPendingLoans
  //
  $scope.fetchPendingLoans = function(){
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/loan/pending'
    })
    .then(function successCallback(response) {
      $scope.Loans = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Retrieve Trips Unconfirmed
  //
  $scope.fetchUnconfirmedTrips = function(){
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/trip/pending/zone?status=1&&id='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.UnconfirmedTrips = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Retrieve Trips Upcoming
  //
  $scope.fetchUpcomingTrips = function(){
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/trip/pending/zone?status=0&&id='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.UpcomingTrips = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Retrieve Trips On Course
  //
  $scope.fetchOnCourseTrips = function(){
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/trip/pending/zone?status=2&&id='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.OnCourseTrips = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Retrieve Trips On Course
  //
  $scope.cancelTrip = function(id){
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/hub/cancel/trip?id=' + id
    })
    .then(function successCallback(response) {
      $scope.doRefresh();
    }, function errorCallback(response) {
    });
  }

  $scope.doRefresh = function() {
    $scope.fetchDrivers();
    $scope.fetchUnconfirmedTrips();
    $scope.fetchUpcomingTrips();
    $scope.fetchPendingLoans();
    $scope.fetchOnCourseTrips();
    $scope.getPendingOrders();
  }

  //*
  //Print Order
  //*
  $scope.printDiv = function(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var popupWin = window.open('', '_blank', 'width=300,height=300');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/lookatstyles.min.css" /><script src="./dist/lookatManage.min.js"></script></head><body onload="window.print()">' + printContents + '</body></html>');
    popupWin.document.close();
  }

  //*
  //Active Driver
  //*
  $scope.activeDriver = function(active, id){
    $scope.startLoading();
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/driver/active?id=' + id + '&active=' + active + '&&idZone='+window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.stopLoading();
      alert('Haz cambiado el status del conductor exitosamente.');
      $scope.fetchDrivers();
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('Error, Ponte en contacto con un administrador si el problema persiste.');
    });
  }

  //*
  //Verify User Log-In
  //*
  $scope.getPendingOrders = function() {
    $http({
      method: 'GET',
      url: ' https://api.lookatapp.co/support/pending/order'
    })
    .then(function successCallback(response) {
      console.log(response);
      $scope.pendingOrders = response.data.data
    }, function errorCallback(response) {
    });
  }

  //*
  //Extend order
  //*
  $scope.extendOrder = function(id) {
    $http({
      method: 'POST',
      url: ' https://api.lookatapp.co/support/extend/order?id=' + id,
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    })
    .then(function successCallback(response) {
      alert('Haz extendido la orden 5 minutos');
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('No pudimos extender la orden' + response.data.message)
    });
  }

  //*
  //Wrap Up
  //*
  $scope.changeZone(zoneId, zoneName);

});
