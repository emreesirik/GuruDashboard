/**
 * Created by emre on 7.2.2015.
 */
app.directive('linechart', function() {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment
        scope: {
            value: '=ngModel'
        },
        link: function ($scope, element, attrs) {
            //TODO resize
            $scope.data = [ { "x": 0, "y": 100 }, { "x": 1, "y": 100 } ];

            var opt = {
                element: element[0],
                width: 150,
                height: 100,
                series: [ {
                    color: attrs.color != undefined ? attrs.color : '#737C7F',
                    data: $scope.data
                } ]
            };
            if(attrs.renderer !=null ){
               opt.renderer = attrs.renderer;
            }

            $scope.graph = new Rickshaw.Graph( opt );
            $scope.graph.render();

            $scope.$watch(element[0].offsetWidth,function(oldVal,newVal) {
                $scope.updateSize();
            });

            $scope.$watch('value',function(newValue,oldValue) {
                if(newValue !=null && newValue != oldValue){
                    $scope.convertValue();
                    $scope.graph.update();
                }
            });

            $scope.updateSize = function () {
                $scope.graph.setSize(element[0].offsetWidth,element[0].offsetHeight);
                $scope.graph.render();
            };

            $(window).resize(function () {
                $scope.updateSize();
            });

            $scope.convertValue = function() {
                for(var i=0;i<$scope.value.length;i++) {
                    var v = $scope.value[i];
                    if(attrs.valuekey != undefined) {
                        v = v[attrs.valuekey];
                    }
                    if($scope.data.length > i) {
                        $scope.data[i].y = v;
                    }else {
                        $scope.data.push({x:i,y:v});
                    }
                    $scope.data[i].time = v.time;
                }
            };

            /*var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                graph: $scope.graph,
                formatter: function(series, x, y) {
                    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
                    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                    var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
                    return content;
                }
            } );*/
        }
    };
});