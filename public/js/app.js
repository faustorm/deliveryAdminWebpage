angular.module("adminWebpage", ['ui.router','adminWebpage.users','slick','adminWebpage.drivers','adminWebpage.promotions','adminWebpage.loans','adminWebpage.data','adminWebpage.payBills','adminWebpage.bar','720kb.datepicker','adminWebpage.index', 'adminWebpage.dashboard','adminWebpage.vehicles','angular-img-cropper','adminWebpage.places', 'adminWebpage.admins','ngMap','adminWebpage.logIn'])
.run(function() {
  Conekta.setPublishableKey('key_ZwsoRuWDTtHrBADoxb7xheg');
  Conekta.setLanguage('es');
})

.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
	$stateProvider
  .state('Vehicles', {
		url: '/vehicles',
		templateUrl: 'templates/vehicles.html',
		controller: 'VehicleController'
	})
  .state('Drivers', {
		url: '/drivers',
		templateUrl: 'templates/drivers.html',
		controller: 'DriverController'
	})
  .state('Places', {
		url: '/places',
		templateUrl: 'templates/places.html',
		controller: 'PlacesController'
	})
  .state('Admins', {
    url: '/admins',
    templateUrl: 'templates/admins.html',
    controller: 'AdminsController',
  })
  .state('PayBill', {
		url: '/pay/bill',
		templateUrl: 'templates/payBills.html',
		controller: 'PayBillsController',
	})
  .state('Dashboard', {
		url: '/dashboard',
		templateUrl: 'templates/dashboard.html',
		controller: 'DashboardController',
	})
	.state('Index', {
		url: '/',
		templateUrl: 'templates/index.html',
		controller: 'LogInController',
	})
  .state('Loans', {
		url: '/loans',
		templateUrl: 'templates/loans.html',
		controller: 'LoansController',
	})
  .state('Analytics', {
		url: '/data',
		templateUrl: 'templates/data.html',
		controller: 'AnalyticsController',
	})
  .state('Promotions', {
		url: '/promotions',
		templateUrl: 'templates/promotions.html',
		controller: 'PromotionsController',
	})
  .state('Users', {
		url: '/users',
		templateUrl: 'templates/users.html',
		controller: 'UsersController',
	})
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
});
