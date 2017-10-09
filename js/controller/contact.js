fiapp.controller('contactCtrl', ['$scope', '$location', '$http', 'APIURL', '$rootScope', 'FB_APP_ID', 'PI_APP_ID', 'SocialShare',
	function($scope, $location, $http, APIURL, $rootScope, FB_APP_ID, PI_APP_ID, SocialShare){

    
    $rootScope.user = {};

    if($location.$$url.indexOf("autologin") != -1){

      $http.get(APIURL+'wp-admin/admin-ajax.php?action=ic_auto_login&autologin='+$location.$$url.split("autologin=")[1]).then(function(res){
        $rootScope.user = res['data']['data'];
      });

      /************************ SOCIAL SHARE ******************************/
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      window.fbAsyncInit = function() {
        FB.init({
          appId      : FB_APP_ID,
          cookie     : true,  // enable cookies to allow the server to access 
                              // the session
          xfbml      : true,  // parse social plugins on this page
          version    : 'v2.5' // use graph api version 2.5
        });
      };

      (function(d, s, id){
          var js, pjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "//assets.pinterest.com/sdk/sdk.js";
          pjs.parentNode.insertBefore(js, pjs);
      }(document, 'script', 'pinterest-jssdk'));

      window.pAsyncInit = function() {
          PDK.init({
              appId: PI_APP_ID, // Change this
              cookie: true
          });
      }
    }

      /************************ SOCIAL SHARE ******************************/

		$scope.success_callback = function(resp, type){
      console.log(resp, type);
    };

    $scope.error_callback = function(resp, type){
      console.log(resp, type);
    };

    $scope.social_share = function(type){
      SocialShare[type]({}, $scope.success_callback, $scope.error_callback);
    };

    $scope.invitation_contacts_list = [];
          $scope.contact = {};

          $scope.add_invitation = function(){
            $scope.invitation_contacts_list.push({name: $scope.contact.name, email: $scope.contact.email});
            $scope.contact = {};
          };

          $scope.remove_contact = function(ind){
            $scope.invitation_contacts_list.splice(ind, 1);
          };

          $('[data-toggle="tooltip"]').tooltip(); 
          $( '#dl-menu' ).dlmenu();  
          $("#menu-toggle").click(function(e) {
              e.preventDefault();
              $("#wrapper").toggleClass("toggled");
          });
          cloudsponge.init({
            // this puts the widget UI inside a div on your page, make sure this element has a height and width
            rootNodeSelector: '#choose-contacts-ui',
            // since we're using deep links, we are going to suppress the widget's display of sources
            skipSourceMenu: true,

            // callbacks let your page respond to important widget events
            afterLaunch: function(){
              // display a Loading... message
              document.getElementById('loading-ui').style.display = "block";
            },
            afterClosing:function(){
              // reset the page's UI state so that another import is possible
              document.getElementById('loading-ui').style.display = "none";
              document.getElementById('choose-account-ui').style.display = "block";
              document.getElementById('choose-contacts-ui').style.display = "none";
            },
            // called before the widget renders the UI with the address book
            beforeDisplayContacts: function(){
              document.getElementById('loading-ui').style.display = "none";
              // hide the Choose account UI and display the Choose contacts UI
              document.getElementById('choose-account-ui').style.display = "none";
              document.getElementById('choose-contacts-ui').style.display = "block";
            },
            // called after the user submits their contacts
            afterSubmitContacts: function(contacts, source, owner) {
              $scope.$apply(function(){
                angular.forEach(contacts, function(val, key){
                  $scope.invitation_contacts_list.push({name: val.first_name+' '+val.last_name, email: val.email[0].address});
                $scope.contact = {};
                });
              });
              // The user has successfully shared their contacts
              // here's where you can send the user to the next step
            }
          });
	}
]);