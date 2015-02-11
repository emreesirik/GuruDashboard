app.directive('odometer', function() {
    return {
        restrict: 'C', //E = element, A = attribute, C = class, M = comment
        scope: {
            value: '=ngModel'
        },
        link: function ($scope, element, attrs) {
            var opt = {
                el: element[0],
                    value: 0
            };
            if(attrs.format !=undefined ) {
                opt.format = attrs.format;
            }
            $scope.od = new Odometer(opt);


            $scope.$watch('value',function(oldVal,newVal) {
                if(oldVal != newVal) {
                    $scope.od.update($scope.value);
                }
            });
        }
    };
});