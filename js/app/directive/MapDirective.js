/**
 * Created by emre on 7.2.2015.
 */
app.directive('dashboardmap',['GuruService', function(GuruService) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment
        scope: {
            value: '=ngModel'
        },
        link: function ($scope, element, attrs) {

            $scope.map =  L.map(element[0].id).setView([50, 0], 1);
            $scope.map.attributionControl.addAttribution("<a href='http://www.peermesh.io'>MapCrate</a>");
            window.map =$scope.map;
                GuruService.retrieveCountries(function(data) {

                $scope.worldLayer = L.geoJson(data, {
                    style:{
                        fillColor: "#C2C2C2",
                        lineColor: "#FFFFFF",
                        color: "#FFFFFF",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 1
                    },
                    onEachFeature: function(feature, layer) {
                        // does this feature have a property named popupContent?
                        if (feature.properties && feature.properties.name) {
                            layer.bindPopup(feature.properties.name,{closeButton:false});
                        }
                    }
                 });

                 $scope.map.addLayer($scope.worldLayer);
            });

            $scope.icon = L.icon({
                iconUrl: 'img/location.png',
                /*shadowUrl: 'leaf-shadow.png',*/

                iconSize:     [28, 28], // size of the icon
                /*shadowSize:   [50, 64], // size of the shadow*/
                iconAnchor:   [14, 14], // point of the icon which will correspond to marker's location
                /*shadowAnchor: [4, 62],  // the same for the shadow*/
                popupAnchor:  [75, 0] // point from which the popup should open relative to the iconAnchor
            });



            $scope.$watch('value',function(oldValue,newValue){
                if(oldValue != newValue) {
                    //L.marker([51.5, -0.09], {icon: greenIcon}).addTo($scope.map);
                    /*L.marker([$scope.value.x, $scope.value.y]).addTo($scope.map);*/
                    var marker = L.marker([$scope.value.x, $scope.value.y],{icon: $scope.icon}).bindPopup($scope.value.popup,{closeButton:false}).addTo($scope.map);
                    marker.on('mouseover', function (e) {
                        this.openPopup();
                    });
                    marker.on('mouseout', function (e) {
                        this.closePopup();
                    });
                }
            });
        }
    };
}]);