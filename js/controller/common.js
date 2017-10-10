fiapp.controller('commonCtrl', ['$scope', 
	function($scope){
		
	    $( '#dl-menu' ).dlmenu();
	}
]);

fiapp.value('APIURL', 'https://financialinsiders.ca/');

//fiapp.value('APIURL', 'http://localhost/financialinsider/');

fiapp.service('SocialShare', function(){
	this.fbShare = function (refurl, callback, callback2) {
        FB.getLoginStatus(function(response) {
		    if (response.status === 'connected') {
		    	FB.api('/me', function(response) {
		    		FB.ui(
					{
					  method: 'share',
					  href: refurl,
					}, function(response1){
						if(Array.isArray(response1))
							callback(response1, 'FB');
						else
							callback2(response1, 'FB');
					});
		    	});
		    }
		});
    };

    this.linkedInShare = function(refurl, callback1, callback2){
    	IN.UI.Authorize().params({"scope":["r_basicprofile", "r_emailaddress"]}).place();
		IN.Event.on(IN, "auth", function(){
			IN.API.Raw("/people/~").result(function(){
				IN.API.Raw("/people/~/shares?format=json")
					  .method("POST")
					  .body(JSON.stringify({
					      "comment": refurl,
					      "visibility": { 
					        "code": "anyone"
					      } 
					    }))
					  .result(function(response1){
						callback(response1, 'LI');
						})
					  .error(function(response1){
						callback2(response1, 'LI');
						});
			}).error(function(response1){
						callback2(response1, 'LI');
						});
		});
    };

    this.pinterestShare = function(refurl, callback1, callback2) {
			PDK.login({ scope : 'read_relationships,read_public' }, function(response){
	            if (!response || response.error) {
	              callback2('Error occurred');
	            } else {
	               console.log(JSON.stringify(response));
	            }
	        //get board info
				var pins = [];
				PDK.request('/v1/me/', function (response) {
				  if (!response || response.error) {
					callback2('Error occurred');
				  } else {
					console.log(JSON.stringify(response));
					//console.log(PDK.getSession().accessToken);
					
					reqestId = response.id;
			
					PDK.pin("http://financialinsiders.ca/wp-content/themes/fi-2016/includes/images/financial-insiders-logo.png", 
						"http://financialinsiders.ca/", "http://financialinsiders.ca/", 
						function(response1){
						callback1(response1, 'PI');
						});
				  }
				});
	        });
		}
});