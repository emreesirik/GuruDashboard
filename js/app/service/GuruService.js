app.factory('GuruService', ['$http', function($http) {
    var factory = {}
    var urlBase = 'js/app/data/';

    factory.machine = null;

    factory.retrieveUserInfo = function () {
        return $http.get(urlBase+'user.json');
    };

    factory.retrieveMachineInfo = function (success) {
        if(factory.machine != null) {
            success(factory.machine);
        }else {
            $http.get(urlBase+'machine.json').success(function(data) {
                factory.machine = data;
                success(factory.machine);
            });
        }
    };

    factory.getTimestamp = function() {
        return new Date().getTime();
    };

    factory.retrieveCountries = function (success) {
        if(factory.countries == null) {
            $http.get(urlBase+'countries.geojson').success(function(data) {
                factory.countries = data;
                success(factory.countries);
            });
        }else {
            success(factory.countries);
        }
    };

    return factory;
}]);