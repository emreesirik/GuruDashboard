/**
 * Created by emre on 7.2.2015.
 */
app.directive('knobchart', function() {
    return {
        restrict: 'C', //E = element, A = attribute, C = class, M = comment
        scope: {
            value: '=ngModel'
        },
        link: function ($scope, element, attrs) {
            var parent = element[0].parentElement;
            $(element[0]).knob();

            $scope.$watch(element[0].offsetWidth,function(oldVal,newVal) {
                $scope.updateChart();
            });

            $scope.updateChart = function () {
                $(element[0]).trigger(
                    'configure',
                    {
                        "width":parent.offsetWidth*3/4,
                        "height":parent.offsetWidth*3/4

                    }
                );

            };

            $(window).resize(function () {
                $scope.updateChart();
            });

            $scope.$watch('value',function(newVal,oldVal) {
                if(newVal != oldVal && newVal != null) {
                    $(element[0])
                        .val($scope.value)
                        .trigger('change');
                }
            });

            $scope.updateChart();

        }
    };
});