fiapp.controller('commonCtrl', ['$scope', 
	function($scope){
		
	    $( '#dl-menu' ).dlmenu();
	}
]);

fiapp.value('APIURL', 'https://financialinsiders.ca/');

//fiapp.value('APIURL', 'http://localhost/financialinsider/');

fiapp.service('SocialShare', function(){
	this.fbShare = function (refurl, callback, callback2) {
        FB.login(function(response) {
		    if (response.authResponse) {
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
		};

	this.twitterShare = function(refurl, twitter_text, callback1, callback2){
		win = window.open('https://twitter.com/intent/tweet?text='+twitter_text+'&url='+encodeURIComponent(refurl),'sharer','toolbar=0,status=0,width=626,height=436');
		var pollTimer = window.setInterval(function() {
		    if (win.closed !== false) { 
		        window.clearInterval(pollTimer);
		        //callback1({}, 'TW');
		    }
		}, 200);
	};
});