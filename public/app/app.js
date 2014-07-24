angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider){
    var routeRoleChecks = {
        user: {auth: function(bfAuth) {
            return bfAuth.authorizeUserForRoute();
        }}
    }

    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main',
            controller: 'mainController'
        })
        .when('/signup', {
            templateUrl: '/partials/signup',
            controller: "signupController"
        })
        .when('/profile', {
            templateUrl: '/partials/profile',
            controller: "profileController",
            resolve: routeRoleChecks.user
        })
        .when('/standings', {
            templateUrl: '/partials/standings',
            controller: "standingsController"
        })
        .when('/picks', {
            templateUrl: 'partials/picks',
            controller: 'picksController',
            resolve: routeRoleChecks.user
        })
});
