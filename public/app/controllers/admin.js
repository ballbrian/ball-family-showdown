angular.module('app').controller('adminController', function($scope, bfIdentity, bfAdminOptions, bfNotifier) {
    var adminOptions = bfAdminOptions.query(function(options) {
        $scope.season = options[0].season;
    });

    $scope.seasons = [{id:"REG", name: "Regular Season"}, {id: "PRE", name: "Preseason"}];

    $scope.reset = false;

    $scope.saveAdminOptions = function() {
        var newAdminOptions = {
            season: $scope.season,
            reset: $scope.reset
        }

       bfAdminOptions.update(newAdminOptions, function() {
           bfNotifier.notify("Admin Options Updated");
       });
    }

})
