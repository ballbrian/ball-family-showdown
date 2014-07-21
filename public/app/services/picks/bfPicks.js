angular.module('app').factory('bfPicks', function($resource, bfUser) {
    var PickResource = $resource('/api/picks/:week/:user', {week: "@week", user: "@user"}, {
        update: {method: "PUT", isArray: false}
    });

    return PickResource;
})
