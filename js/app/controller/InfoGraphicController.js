var InfoGraphicController = function($scope,$location, GuruService) {
    $scope.plant = 0;
    $scope.energy = 0;
    $scope.matter = 0;
    $scope.melting = 0;
    $scope.disease = 0;

    setTimeout(function() {
        GuruService.retrieveMachineList(function(data) {
            GuruService.retrieveMachineInfo(data[0].token,function(data) {
                $scope.plant = data.computed.plants;
                $scope.energy = data.computed.energy;
                $scope.matter = data.computed.floe;
                $scope.melting = data.computed.radioactiveMatter;
                $scope.disease = data.computed.diseased;
            });

        });
        },2000);

    $scope.onDashboardClick = function() {
        $location.path('dashboard');
    };

};

InfoGraphicController.$inject = ['$scope', '$location' ,'GuruService'];
app.controller('InfoGraphicController', InfoGraphicController);