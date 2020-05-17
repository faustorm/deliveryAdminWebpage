angular.module('adminWebpage.placeheader', []).directive('placeheader', function () {
  return {
    template:
    '<div class="col-xs-12 btn-shadow" style="margin-bottom: 15px;">'+
      '<header class="jumbotron place-jumbotron">'+
				'<div class="row" style="height: 100%;">'+
					'<div class="col-lg-12" style="background: url({{place.coverPicture}}); background-repeat: no-repeat; background-size: cover; background-position: 50% 50%; padding: 0; height: 100%;">'+
						'<div class="panel-heading place-jumbotron-master">'+
              '<div class="col-md-4 col-md-offset-4">'+
                '<img class="img-circle" src="{{place.logo}}">'+
              '</div><br>'+
              '<div class="col-md-6 col-md-offset-3" style="text-align: center;">'+
                '<h3 class="page-header">'+
                '{{place.place}}<text> - {{place.branch}}</text></h3>'+
              '</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</header>'+
    '</div>',
    restrict: 'E',
    transclude: true,
    replace:true,
    scope:true
  };
})
