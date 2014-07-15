angular.module('app').controller('signupController', function($scope, bfAuth, bfUser, bfNotifier, $location) {

    $scope.signup = function() {
        var newUserData = {
            username: $scope.email,
            password: $scope.password,
            firstName: $scope.firstName,
            lastName: $scope.lastName
        };

        bfAuth.createUser(newUserData).then(function () {
            bfNotifier.notify("User Account Created!");
            $location.path('/');
        }, function (reason) {
            bfNotifier.error(reason);
        })
    }

});
