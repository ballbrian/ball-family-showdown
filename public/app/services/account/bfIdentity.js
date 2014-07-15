angular.module('app').factory('bfIdentity', function($window, bfUser) {
    var currentUser;
    if(!!$window.userObject) {
        currentUser = new bfUser();
        angular.extend(currentUser, $window.userObject);
    }
    return {
        currentUser: currentUser,
        isAuthenticated: function() {
            return !!this.currentUser;
        }
    }
});
