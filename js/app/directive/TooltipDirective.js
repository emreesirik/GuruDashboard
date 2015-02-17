app.directive('tooltip', function() {
    return {
        restrict: 'A', //E = element, A = attribute, C = class, M = comment
        /*scope: {
            value: '=ngModel'
        },*/
        link: function ($scope, element, attrs) {
            $(element[0]).tooltipster({
                animation: 'fade',
                delay: 200,
                content: attrs.tooltip,
                theme: 'tooltipster-guru',
                position: 'right'
                /*,trigger: "click"*/
            });
        }
    };
});