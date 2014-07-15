angular.module('app').factory('bfWeeks', function($resource) {
    var WeeksResource = $resource('/api/weeks/:_id', {_id: "@id"});

    return WeeksResource;
})
