angular.module('app').factory('bfStandings', function($resource) {
    var StandingsResource = $resource('/api/standings', {});

    return StandingsResource;
})
