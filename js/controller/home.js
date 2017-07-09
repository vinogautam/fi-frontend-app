fiapp.controller('homeCtrl', ['$scope',
	function($scope){
		$("#menu-toggle").click(function(e) {
	        e.preventDefault();
	        $("#wrapper").toggleClass("toggled");
	    });
	}
]);