angular.module('app').directive("emptyOption", ["$timeout", function ($timeout) {
    return {
        restrict: "A",
        require: "^ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
            //Get "SELECT" element of empty option
            var parentSelectDom = element[0].parentNode,
                removed = false;

            //Make sure the element is "SELECT" before proceeding.
            if (parentSelectDom.nodeName === "SELECT") {

                //When $modelValue changes, either add/remove empty option
                //based on whether or not $modelValue is defined.
                scope.$watch(function () {
                    return ngModelCtrl.$modelValue;
                }, function (newVal, oldVal) {
                    if (newVal === undefined) {
                        if (removed) {
                            $timeout(function () {
                                //Add empty option back to list.
                                parentSelectDom.add(element[0], parentSelectDom[0]);
                            }, 0);
                            removed = false;
                        }
                    }
                    else if (!removed) {
                        $timeout(function () {
                            //remove empty option.
                            parentSelectDom.remove(0);
                        }, 0);
                        removed = true;
                    }
                });
            }
        }
    }
}]);
