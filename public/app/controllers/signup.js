angular.module('app').controller('signupController', function($scope, $upload, bfAuth, bfUser, bfNotifier, $location) {

    $scope.onFileSelect = function($file) {
        $scope.upload = $upload.upload({
            url: '/test',
            file: $file
        }).success(function(data, status, headers, config) {
            console.log(data);
        })
    }


    $scope.signup = function() {
        var newUserData = {
            username: $scope.username,
            email: $scope.email,
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
