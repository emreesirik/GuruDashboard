var app = angular.module('GuruApp',['ngRoute','easypiechart']);


app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/infographics', {
                templateUrl: 'js/app/view/infographic.html',
                controller: 'InfoGraphicController'
            }).
            when('/dashboard', {
                templateUrl: 'js/app/view/dashboard.html',
                controller: 'DashboardController'
            }).
            otherwise({
                redirectTo: '/infographics'
            });
    }]);
