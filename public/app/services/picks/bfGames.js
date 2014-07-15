angular.module('app').factory('bfGames', function($resource) {
    var GamesResource = $resource('/api/games/:week', {week: "@week"});

    return GamesResource;
})
