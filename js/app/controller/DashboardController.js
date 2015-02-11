var DashboardController = function($scope,$location, GuruService) {
    $scope.guruPoint = 0;
    $scope.cpuUsageData = [];
    $scope.gpuUsageData = [];
    $scope.ramUsageData = [];
    $scope.cpu = {};
    $scope.gpu = {};
    $scope.ram = {};
    $scope.energy = {};
    $scope.travel = {};
    $scope.page = "dashboard";


    $scope.init = function() {

        $scope.cpuChartOptions =$scope.createCircularChartOptions('#75CEAB');
        $scope.gpuChartOptions =$scope.createCircularChartOptions('#F4FD29');
        $scope.ramChartOptions =$scope.createCircularChartOptions('#FA7721');

        GuruService.retrieveUserInfo().success(function(data) {
            /*$scope.userAvatar = data.userAvatar;*/
            $scope.name = data.firstName;
            $scope.surname = data.lastName;
            $scope.email = data.email;
        });

        GuruService.retrieveMachineInfo(function(value) {
            var location = value.data.country+" "+ value.data.city+" "+value.data.region;
            $scope.position = {
                x: value.data.latitude,
                y: value.data.longitude,
                popup : location
            };

            $scope.energy = {
                wasted: value.data.energy.wasted,
                postfix: value.data.energy.unit,
                ratio: (value.data.energy.wasted * 100) / (value.data.energy.used)
            }

            $scope.cpu = {
                type: value.data.cpu.type,
                core: value.data.cpu.coreCount,
                rate: value.data.cpu.frequency
            };

            if(value.data.travel == undefined) {
                $scope.isShowTravel = false;
            }

            $scope.guruPointData = value.graphs.guruPoints;
            $scope.guruPoint = $scope.guruPointData[$scope.guruPointData.length-1].point;

            $scope.updateLiveCharts(value.graphs.cpu,value.graphs.gpu,value.graphs.ram);
            setTimeout($scope.retrieveLiveChartData,DashboardController.TIME_INTERVAL);
        });
    };
    $scope.cpuStack = [];
    $scope.gpuStack = [];
    $scope.ramStack = [];

    $scope.retrieveLiveChartData = function() {
        $scope.cpuStack = $scope.generateRandomList(false);
        $scope.gpuStack = $scope.generateRandomList(true);
        $scope.ramStack = $scope.generateRandomList(true);
        setTimeout($scope.popStack,DashboardController.PERIOD);
    };

    $scope.popStack = function() {
        var cpu = [$scope.cpuStack.pop()];
        var gpu = [$scope.gpuStack.pop()];
        var ram = [$scope.ramStack.pop()];
        $scope.updateLiveCharts(cpu,gpu,ram);
        if($scope.cpuStack.length>0) {
            setTimeout($scope.popStack,DashboardController.PERIOD);
        }else {
            setTimeout($scope.retrieveLiveChartData,DashboardController.PERIOD);
        }
    };

    $scope.updateLiveCharts = function(cpu,gpu,ram) {
        setTimeout(function(){
            $scope.cpuPercent = cpu[cpu.length-1].cpuPercent;
            var gpuValue = gpu[gpu.length-1];
            $scope.gpuPercent =parseInt(gpuValue.used * 100 / gpuValue.total);
            var ramValue = ram[ram.length-1];
            $scope.ramPercent =parseInt(ramValue.used * 100 / ramValue.total);

            $scope.gpu = {
                total: $scope.bytesToSize(gpuValue.total,2),
                unused:$scope.bytesToSize(gpuValue.total - gpuValue.used,2),
                used: $scope.bytesToSize(gpuValue.used,2)
            };
            $scope.ram = {
                total: $scope.bytesToSize(ramValue.total,2),
                unused:$scope.bytesToSize(ramValue.total - ramValue.used,2),
                used: $scope.bytesToSize(ramValue.used,2)
            };
            $scope.cpuUsageData = $scope.createChartList($scope.cpuUsageData,cpu,false);
            $scope.gpuUsageData = $scope.createChartList($scope.gpuUsageData,gpu,true);
            $scope.ramUsageData = $scope.createChartList($scope.ramUsageData,ram,true);

            $scope.$apply();
        },0);

    };

    $scope.createChartList = function(list,newList,isCalculate) {
        var rtr = [];
        for(var i = 0 ; i< list.length;i++) {
            rtr.push(list[i]);
        }
        for(var i = 0 ; i< newList.length;i++) {
            if(isCalculate) {

                newList[i].unused = 100 * newList[i].total / (newList[i].total - newList[i].used);
            }
            rtr.push(newList[i]);
        }
        return rtr;
    };


    //DUMMY DATA
    $scope.generateRandom = function() {
        return   parseInt(Math.random() * 100);
    };

    $scope.generateRandomList = function(isCalculate) {
        var rtr = [];
        for(var i=0;i<5;i++) {
            if(isCalculate) {
                rtr.push({used: $scope.generateRandom(),total:100,time:"23133231"});
            }else {
                rtr.push({cpuPercent: $scope.generateRandom(),time:"23133231"});
            }
        }
        return rtr;
    };

    $scope.createCircularChartOptions = function(color) {
        return { animate:{duration:500,enabled:true },trackColor:'#f2f2f2',barColor:color, scaleColor:false, lineWidth:3, lineCap:'butt' ,size:80};
    };

    $scope.bytesToSize = function(bytes, precision) {
        var kilobyte = 1024;
        var megabyte = kilobyte * 1024;
        var gigabyte = megabyte * 1024;
        var terabyte = gigabyte * 1024;

        if ((bytes >= 0) && (bytes < kilobyte)) {
            return bytes + ' B';

        } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
            return (bytes / kilobyte).toFixed(precision) + ' KB';

        } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
            return (bytes / megabyte).toFixed(precision) + ' MB';

        } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
            return (bytes / gigabyte).toFixed(precision) + ' GB';

        } else if (bytes >= terabyte) {
            return (bytes / terabyte).toFixed(precision) + ' TB';

        } else {
            return bytes + ' B';
        }
    };

    $scope.init();
};
DashboardController.PERIOD = 1000;
DashboardController.TIME_INTERVAL = 5000;
DashboardController.$inject = ['$scope', '$location' ,'GuruService'];
app.controller('DashboardController', DashboardController);
