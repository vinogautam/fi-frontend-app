fiapp.controller('contactCtrl', ['$scope', '$location', '$http', 'APIURL', '$rootScope',
	function($scope, $location, $http, APIURL, $rootScope){

    
    $rootScope.user = {};

    if($location.$$url.indexOf("autologin") != -1){

      $http.get(APIURL+'wp-admin/admin-ajax.php?action=ic_auto_login&autologin='+$location.$$url.split("autologin=")[1]).then(function(res){
        $rootScope.user = res['data']['data'];
      });
    }

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