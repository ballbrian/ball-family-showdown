angular.module('app').factory('bfPicks', function($resource) {
    var PickResource = $resource('/api/picks/:_id', {_id: "@id"});

    return PickResource;
})
