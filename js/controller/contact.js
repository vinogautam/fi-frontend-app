fiapp.controller('contactCtrl', ['$scope',
	function($scope){
		$("#menu-toggle").click(function(e) {
	        e.preventDefault();
	        $("#wrapper").toggleClass("toggled");
	    });
	}
]);