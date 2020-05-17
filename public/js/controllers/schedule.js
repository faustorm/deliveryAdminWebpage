angular.module('adminWebpage.schedule', ['adminWebpage.couponmodal']).controller('ScheduleController', function( $scope, $http, $window ) {
  $scope.modalInfo = {};
  $scope.edit = {};
  $scope.Schedules = [];

  $scope.logOut = function() {
    localStorage.clear();
    window.location.href= ("/dashboard");
  }
  $scope.startLoading = function(){
    $('.spinnerDiv').show();
  };
  $scope.stopLoading = function(){
    $('.spinnerDiv').hide();
  };


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
      $scope.modalInfo.image = response.data.data[0].coverPicture;
    }, function errorCallback(response) {
    });
  }

  //*
  //Fetch schedules
  //*
  $scope.fetchSchedules = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/schedule/' + window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.Schedules = response.data.data;
    }, function errorCallback(response) {
    });
  }

  //*
  //Transform Schedules
  //*
  $scope.transformSchedule = function(dayStart, dayEnd) {
    var transformedStart;
    var transformedEnd;
    switch (dayStart) {
      case '1':
        transformedStart = 'Lunes'
        break;
      case '2':
        transformedStart = 'Martes'
        break;
      case '3':
        transformedStart = 'Miercoles'
        break;
      case '4':
        transformedStart = 'Jueves'
        break;
      case '5':
        transformedStart = 'Viernes'
        break;
      case '6':
        transformedStart = 'Sabado'
        break;
      case '7':
        transformedStart = 'Domingo'
        break;
    }
    switch (dayEnd) {
      case '1':
        transformedEnd = 'Lunes'
        break;
      case '2':
        transformedEnd = 'Martes'
        break;
      case '3':
        transformedEnd = 'Miercoles'
        break;
      case '4':
        transformedEnd = 'Jueves'
        break;
      case '5':
        transformedEnd = 'Viernes'
        break;
      case '6':
        transformedEnd = 'Sabado'
        break;
      case '7':
        transformedEnd = 'Domingo'
        break;
    }
    if(transformedEnd == transformedStart) {
      return transformedStart
    } else {
      return transformedStart + ' - ' + transformedEnd
    }
  }

  //*
  //Transform numbers of days
  //*
  $scope.transformDays = function(dayStart, dayEnd) {
    var dayString = '';
    var actualRender;
    var parsedStart = Number(dayStart);
    var parsedEnd = Number(dayEnd);
    dayString += dayStart

    if(dayStart != dayEnd) {
      for (var i = 0; i < 8; i++) {
        if(i > parsedStart && i < parsedEnd) {
          var actualRender = i.toString();
          dayString += ',' + actualRender
        }
      }
      dayString += ',' + dayEnd;
      return dayString
    } else {
      return dayStart
    }
  }

  //*
  //Post Schedule
  //*
  $scope.postSchedule = function(place){
    $scope.startLoading();
    var date = $scope.transformSchedule(place.dayStart, place.dayEnd)
    var days = $scope.transformDays(place.dayStart, place.dayEnd);
    schedule_request = {
      date : date,
      startTime : place.startTime,
      endTime : place.endTime,
      idPlace : window.localStorage["actualId"],
      days : days
    }
    $http({
      method: 'POST',
      url: 'https://api.lookatdelivery.com/schedule',
      headers: {"Content-Type": "application/json;charset=UTF-8"},
      data: schedule_request
    })
    .then(function successCallback(response) {
      $scope.addingSchedule = false;
      $scope.stopLoading();
      $scope.fetchSchedules();
      alert('Haz agregado este horario exitosamente.');
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('No hemos podido, si el problema persiste no dudes en ponerte en contacto con nosotros.');
    });
  }

  //*
  //Prepare to add schedule
  //*
  $scope.prepareAddSchedule = function() {
    $scope.addingSchedule = true;
    $scope.modalInfo.title = 'Agregar Horario';
    $scope.modalInfo.description = 'Esto le servira a tus clientes para cuando te visiten, hagan pedidos o reservaciones.'
  }

  //*
  //Edit Schedule
  //
  $scope.editSchedule = function(edit){
    $scope.startLoading();
    var date = $scope.transformSchedule($scope.edit.dayStart, $scope.edit.dayEnd)
    var days = $scope.transformDays($scope.edit.dayStart, $scope.edit.dayEnd);
    var schedule_request = {
      date : date,
      startTime : $scope.edit.startTime,
      endTime : $scope.edit.endTime,
      idPlace : window.localStorage["actualId"],
      days : days
    }
    $http({
      method: 'PUT',
      url: 'https://api.lookatdelivery.com/schedule/manage?id=' + $scope.edit.id,
      headers: {"Content-Type": "application/json;charset=UTF-8"},
      data: schedule_request
    })
    .then(function successCallback(response) {
      $scope.stopLoading();
      alert('Haz editado este horario exitosamente')
      $scope.editingSchedule = false;
      $scope.edit = {};
      $scope.fetchSchedules();
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('No hemos podido, si el problema persiste no dudes en ponerte en contacto con nosotros.');
    });
  }

  //*
  //Prepare to edit schedule
  //*
  $scope.prepareEditSchedule = function(id) {
    $scope.editingSchedule = true;
    $scope.modalInfo.title = 'Editar Horario';
    for(var i = 0; i < $scope.Schedules.length + 1; i++) {
      if(id == $scope.Schedules[i].id) {
        $scope.edit = $scope.Schedules[i];
      }
    }
  }

  //*
  //Delete Schedule
  //*
  $scope.deleteSchedule = function(id) {
    $scope.startLoading();
    $http({
      method: 'DELETE',
      url: "https://api.lookatdelivery.com/schedule?id=" + id + "&idPlace=" + window.localStorage["actualId"]
    })
    .then(function successCallback(response) {
      $scope.editingSchedule = false;
      $scope.edit = {};
      $scope.stopLoading();
      alert('Haz eliminado este horario exitosamente.');
      $scope.fetchSchedules();
    }, function errorCallback(response) {
      $scope.stopLoading();
      alert('No hemos podido eliminar este horario, si el problema persiste ponte en contacto con nosotros.');
    });
  }

  //Wrap Up
  $scope.getPlaceInfo();
  $scope.fetchSchedules();

})
