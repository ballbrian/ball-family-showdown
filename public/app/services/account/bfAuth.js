angular.module('app').factory('bfAuth', function($http, bfIdentity, $q, bfUser) {
   return {
       authenticateUser: function(username, password) {
           var dfd = $q.defer();
           $http.post('/login', {username:username, password:password}).then(function(response) {
               if(response.data.success) {
                   var user = new bfUser();
                   angular.extend(user, response.data.user);
                   bfIdentity.currentUser = user;
                   dfd.resolve(true);
               } else {
                   dfd.resolve(false);
               }
           });
           return dfd.promise;
       },

       createUser: function(newUserData) {
            var newUser = new bfUser(newUserData);
            var dfd = $q.defer();

           newUser.$save().then(function() {
               bfIdentity.currentUser = newUser;
               dfd.resolve();
           }, function(response) {
               dfd.reject(response.data.reason);
           });

           return dfd.promise;
       },

       updateCurrentUser: function(newUserData) {
           var dfd = $q.defer();

           var clone = angular.copy(bfIdentity.currentUser);
           angular.extend(clone, newUserData);
           clone.$update().then(function() {
               bfIdentity.currentUser = clone;
               dfd.resolve();
           }, function(response) {
               dfd.reject(response.data.reason);
           });
           return dfd.promise;
       },

       logoutUser: function() {
           var dfd = $q.defer();
           $http.post('/logout',  {logout:true}).then(function() {
               bfIdentity.currentUser = undefined;
               dfd.resolve();
           });
           return dfd.promise;
       },

       authorizeUserForRoute: function() {
           if(bfIdentity.isAuthenticated()) {
               return true;
           } else {
               return $q.reject('Not Authorized');
           }
       }

   }
});
