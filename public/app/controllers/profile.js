angular.module('app').controller('profileController', function($scope, bfAuth, bfIdentity, bfNotifier) {
    $scope.email = bfIdentity.currentUser.username;
    $scope.firstName = bfIdentity.current.firstName;
    $scope.lastName = bfIdentity.current.lastName;

    $scope.update = function() {
        var newUserData = {
            username: $scope.email,
            firstName : $scope.firstName,
            lastName : $scope.lastName
        }

        if($scope.password && $scope.password.length > 0) {
            newUserData.password = $scope.password;
        }

        bfAuth.updateCurrentUser(newUserData).then(function() {
            bfNotifier.notify("Your Account has been Updated");
        }, function(reason) {
            bfNotifier.error(reason);
        })
    }
})
