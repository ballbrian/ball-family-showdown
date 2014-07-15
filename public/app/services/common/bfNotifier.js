angular.module('app').value('bfToastr', toastr);

angular.module('app').factory('bfNotifier', function(bfToastr) {
    return {
        notify: function(msg) {
            bfToastr.success(msg);
            console.log(msg);
        },
        error: function(msg) {
            bfToastr.error(msg);
            console.log(msg);
        }


    }
});
