var DashboardController = function($scope,$location, GuruService) {

    $scope.page = "dashboard";
    $scope.selectedComputer = null;


    $scope.init = function() {

        $scope.cpuChartOptions =$scope.createCircularChartOptions('#75CEAB');
        $scope.gpuChartOptions =$scope.createCircularChartOptions('#F4FD29');
        $scope.ramChartOptions =$scope.createCircularChartOptions('#FA7721');
        $scope.initVariables();
        GuruService.retrieveUserInfo(function(data) {
            /*$scope.userAvatar = data.userAvatar;*/
            $scope.name = data.firstName;
            $scope.surname = data.lastName;
            $scope.email = data.email;

            GuruService.retrieveMachineList(function(list) {
                $scope.machineList = list;
                $scope.selectedComputer = $scope.machineList[0];
                $scope.retrieveMachineInfo($scope.selectedComputer.token);
            });
        });
    };

    $scope.initVariables = function() {
        $scope.guruPoint = 0;
        $scope.cpuUsageData = [];
        $scope.gpuUsageData = [];
        $scope.ramUsageData = [];
        $scope.cpu = {};
        $scope.gpu = {};
        $scope.ram = {};
        $scope.energy = {};
        $scope.travel = {};
    };

    $scope.onSelectComputer = function(computer) {
        $scope.selectedComputer = computer;
        $scope.initVariables();
        $scope.retrieveMachineInfo(computer.token,false);
    };

    $scope.retrieveMachineInfo = function(machineToken,isStartPeriod) {
        GuruService.retrieveMachineInfo( machineToken, function(value) {
            var location = value.data.country+" "+ value.data.city+" "+value.data.region;
            //var location = value.data.country+" "+ value.data.city+" "+value.data.region;
            $scope.position = {
                x: value.data.latitude,
                y: value.data.longitude,
                popup : location
            };

            $scope.isShowEnergy = value.computed.energy.wasted != 0;

            $scope.energy = {
                wasted: value.computed.energy.wasted,
                postfix: value.computed.energy.unit,
                ratio: (value.computed.energy.wasted * 100) / (value.computed.energy.used)
            };
            var brand = value.data.cpu.brand;
            var indexOfAt = brand.indexOf("@");
            if(indexOfAt>=0){
                brand = brand.substring(0,indexOfAt);
            }
            $scope.cpu = {
                type: brand,
                core: value.data.cpu.coreCount,
                rate: parseFloat(value.data.cpu.frequency).toFixed(2)
            };

            $scope.isShowTravel = value.data.travel != undefined;

            $scope.guruPointData = value.graphs.guruPoints;
            if($scope.guruPointData.length > 0 ){
                $scope.guruPoint = $scope.guruPointData[$scope.guruPointData.length-1].point;
                $scope.isShowGuruPoint = true;
            }else {
                $scope.isShowGuruPoint = false;
            }
            $scope.isShowGPU = value.graphs.gpuRam != undefined && value.graphs.gpuRam.length > 0;


            //remove
            $scope.lastTime =  value.graphs.cpu.length > 0 ? value.graphs.cpu[0].time : APIRequest.getTimestamp();
            $scope.updateLiveCharts(value.graphs.cpu,value.graphs.gpuRam,value.graphs.ram);
            if(isStartPeriod == undefined || isStartPeriod) {
                setTimeout($scope.retrieveLiveChartData,DashboardController.TIME_INTERVAL);
            }
        });
    };

    $scope.cpuStack = [];
    $scope.gpuStack = [];
    $scope.ramStack = [];

    //TODO eesirik request to service
    $scope.retrieveLiveChartData = function() {
        GuruService.retrieveChartData($scope.selectedComputer.token,$scope.lastTime, function(list1,list2,list3) {
            if(list1.length > 0) {
                $scope.lastTime = list1[0].time;
                $scope.cpuStack = list1;
                $scope.gpuStack = list2;
                $scope.ramStack = list3;
            }
            setTimeout($scope.popStack,DashboardController.PERIOD);
        });
    };

    $scope.popStack = function() {
        if($scope.cpuStack.length>0) {
            var cpu = [$scope.cpuStack.pop()];
            var gpu = [$scope.gpuStack.pop()];
            var ram = [$scope.ramStack.pop()];
            $scope.updateLiveCharts(cpu,gpu,ram);
        }
        if($scope.cpuStack.length>0) {
            setTimeout($scope.popStack,DashboardController.PERIOD);
        }else {
            setTimeout($scope.retrieveLiveChartData,DashboardController.PERIOD);
        }
    };

    $scope.updateLiveCharts = function(cpu,gpu,ram) {
        setTimeout(function(){
            $scope.cpuPercent =cpu.length > 0 ? 100 - cpu[0].cpuPercent : 0;
            var gpuValue = gpu.length > 0 && gpu[0] != undefined ? gpu[0] : {used:100,total:100};

            $scope.gpuPercent = 100 - parseInt(gpuValue.used * 100 / gpuValue.total);
            var ramValue = ram.length > 0 && ram[0] != undefined ? ram[0] :  {used:100,total:100};
            $scope.ramPercent = 100 - parseInt(ramValue.used * 100 / ramValue.total);

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
        if(newList.length==0 || newList[0] == undefined) {
            return list;
        }
        var rtr = [];
        for(var i = 0 ; i< list.length;i++) {
            rtr.push(list[i]);
        }
        for(var i = newList.length-1 ; i>=0 ;i--) {
            if(isCalculate) {

                newList[i].unused = 100 * newList[i].total / (newList[i].total - newList[i].used);
            }else {
                newList[i].cpuPercent = 100 - newList[i].cpuPercent;
                APIRequest.printTimestamp(newList[i].time);
            }
            rtr.push(newList[i]);
        }
        return rtr;
    };




    $scope.createCircularChartOptions = function(color) {
        return { animate:{duration:500,enabled:true },trackColor:'#f2f2f2',barColor:color, scaleColor:false, lineWidth:3, lineCap:'butt' ,size:80};
    };

    $scope.bytesToSize = function(bytes, precision) {
        bytes = bytes * 1024;
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
DashboardController.PERIOD = 2000;
DashboardController.TIME_INTERVAL = 5000;
DashboardController.$inject = ['$scope', '$location' ,'GuruService'];
app.controller('DashboardController', DashboardController);
