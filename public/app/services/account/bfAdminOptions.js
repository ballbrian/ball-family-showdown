angular.module('app').factory('bfAdminOptions', function($resource) {
        var AdminOptionsResource = $resource('/api/adminOptions', {}, {
            update: {method: "PUT", isArray: false}
        });

        AdminOptionsResource.prototype.isAdmin = function() {
            return this.roles && this.roles.indexOf('admin') > -1;
        }

        return AdminOptionsResource;
});
