fiapp.controller('commonCtrl', ['$scope', 
	function($scope){
		
	    $( '#dl-menu' ).dlmenu();
	}
]);

fiapp.value('APIURL', 'https://financialinsiders.ca/');

//fiapp.value('APIURL', 'http://localhost/financialinsider/');