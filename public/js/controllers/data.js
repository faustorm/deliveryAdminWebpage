angular.module('adminWebpage.data', []).controller('AnalyticsController', function( $scope, $http, $window, NgMap ) {
  $scope.currentMarker = {};
  $scope.totalTrips = 0;
  $scope.search = {
    startTime: moment().format('YYYY/MM/DD'),
    endTime: moment().format('YYYY/MM/DD')
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
  //Retrieve Info place
  //
  $scope.getPlacesSubscribed = function() {
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/hub/analytics/places'
    })
    .then(function successCallback(response) {
      $scope.places = response.data.data;
      $scope.currentMarker = $scope.places[0];
      console.log($scope.places);
    }, function errorCallback(response) {
    });
  }

  $scope.SetMapCenter = function(place) {
    console.log('si')
    NgMap.getMap().then(function(map) {
      $scope.currentMarker = place;
      var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
      google.maps.LatLng(place.lat, place.lng);
      map.setCenter(new google.maps.LatLng(place.lat, place.lng));
      new google.maps.InfoWindow({
          disableAutoPan: true
      });
      map.showInfoWindow("myInfoWindow", place.id.toString());
		});
  }


  $scope.ShowInfoWindow = function(place) {
    console.log('fuck')
    NgMap.getMap().then(function(map) {
      map.showInfoWindow("myInfoWindow", place.id.toString());
    });
  }

  //*
  //Retrieve Trips Info
  //
  $scope.TripsAnalytics = function() {
    console.log($scope.search)
    var search = $scope.search;
    $scope.totalTrips = 0;
    console.log('https://api.lookatdelivery.com/hub/analytics/trips?start='+ search.startTime + '&&end=' + search.endTime)
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/hub/analytics/trips?start='+ search.startTime + '&&end=' + search.endTime
    })
    .then(function successCallback(response) {
      $scope.trips = response.data.data;
      for(var i =0; i < $scope.trips.length; i++) {
        $scope.totalTrips += $scope.trips[i].count
      }
      console.log($scope.trips);
    }, function errorCallback(response) {
    });
    $http({
      method: 'GET',
      url: 'https://api.lookatdelivery.com/hub/analytics/drivers?start='+ search.startTime + '&&end=' + search.endTime
    })
    .then(function successCallback(response) {
      $scope.drivers = response.data.data;
      console.log($scope.drivers);
    }, function errorCallback(response) {
    });
  }

  //Wrap up
  $scope.getPlacesSubscribed();
  $scope.TripsAnalytics();

})
