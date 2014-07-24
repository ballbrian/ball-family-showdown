angular.module('app').controller('standingsController', function($scope, bfStandings) {
    $scope.standings = bfStandings.query();
})
