var fiapp = angular.module('app', 
    ['ui.router'])

.config(routes);

function routes($stateProvider, $urlRouterProvider) {

    // default route
    $urlRouterProvider
        .when('', '/home');

    var states = [
    'home', 'contact'
    ];

    angular.forEach(states, function (state) {
        $stateProvider.state({
            name: state,
            url: '/'+state,
            templateUrl: 'templates/'+state+'.html',
            controller: state+'Ctrl'
        });
    });
}