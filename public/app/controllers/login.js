angular.module('app').controller('loginController', function($scope, $http, bfIdentity, bfNotifier, bfAuth, $location) {
    $scope.identity = bfIdentity;
    $scope.signin = function(username, password) {
        bfAuth.authenticateUser(username, password).then(function(success) {
           if(success) {
               $('.navbar-collapse').collapse('hide');
               $location.path('/picks');
               bfNotifier.notify('You have successfully signed in!');
           } else {
               bfNotifier.error('Username/Password combination incorrect');
           }
        });
    }
    $scope.signout = function() {
        bfAuth.logoutUser().then(function() {
            $scope.username = "";
            $scope.password = "";
            bfNotifier.notify("You have successfully signed out!");
            $location.path('/');
        });
    }
});
