app.factory('GuruService', ['$http', function($http) {
    var factory = {}

    //TODO set is false to retrieve data from services
    factory.isDummyData = false;

    var urlBase = 'js/app/data/';

    factory.machine = null;
    factory.user = null;
    factory.machineList = null;

    factory.retrieveUserInfo = function (success) {
        if(factory.user != undefined) {
            success(factory.user);
        }else {
            var fn = function(data) {
                factory.user = data;
                success(factory.user);
            };
            if(factory.isDummyData){
                $http.get(urlBase+'user.json').success(fn);
            }else {
                APIRequest.requestUser($http).success(fn);
            }
        }
    };

    factory.retrieveMachineList = function(success) {
        if(factory.machineList) {
            success(factory.machineList);
        }else {
            var fn = function(data){
                factory.machineList = data;
                success(data);
            };
            if(factory.isDummyData) {
                $http.get(urlBase+'machines.json').success(fn);
            }else {
                APIRequest.requestMachines($http).success(fn);
            }
        }
    };

    factory.retrieveMachineInfo = function (machineToken, success) {
        if(factory.machine != null) {
            success(factory.machine);
        }else {
            var fn = function(data) {
                factory.machine = data;
                success(factory.machine);
            };
            if(factory.isDummyData) {
                $http.get(urlBase+'machine.json').success(fn);
            }else {
                APIRequest.requestMachine($http, machineToken).success(fn);
            }
        }
    };

    //DUMMY DATA
    factory.generateRandom = function() {
        return   parseInt(Math.random() * 100);
    };

    factory.retrieveChartData = function(machineToken,lastTime, success) {
        if(factory.isDummyData) {
            var cpuStack = factory.generateRandomList(false);
            var gpuStack = factory.generateRandomList(true);
            var ramStack = factory.generateRandomList(true);
            success(cpuStack,gpuStack,ramStack);
        }else {
            APIRequest.requestChartData($http,machineToken,lastTime).success(function(data){
                success(data.graphs.cpu,data.graphs.gpuRam,data.graphs.ram);
            });
        }
    };

    factory.generateRandomList = function(isCalculate) {
        var rtr = [];
        for(var i=0;i<5;i++) {
            if(isCalculate) {
                rtr.push({used: factory.generateRandom(),total:100,time:"23133231"});
            }else {
                rtr.push({cpuPercent: factory.generateRandom(),time:"23133231"});
            }
        }
        return rtr;
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