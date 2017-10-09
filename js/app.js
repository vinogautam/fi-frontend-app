var fiapp = angular.module('app', 
    ['ui.router'])

.config(routes);

function routes($stateProvider, $urlRouterProvider) {

    // default route
    $urlRouterProvider
        .when('', '/home');

    var states = [
    'home', 'contact', 'consultation', 'financial'
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

 fiapp.value('FB_APP_ID', '1801608280082028');
 fiapp.value('LI_APP_ID', '865r9ywbcc2tra');
 fiapp.value('PI_APP_ID', '4867120598806966651');