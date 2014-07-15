angular.module('app').factory('bfTeams', function($resource) {
    var TeamsResource = $resource('/api/teams/:_id', {_id: "@id"});

    return TeamsResource;
})
