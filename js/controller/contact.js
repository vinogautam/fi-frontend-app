fiapp.controller('contactCtrl', ['$scope', '$location', '$http', 'APIURL', '$rootScope', 'FB_APP_ID', 'PI_APP_ID', 'SocialShare',
	function($scope, $location, $http, APIURL, $rootScope, FB_APP_ID, PI_APP_ID, SocialShare){

    
    $rootScope.user = {};

    $scope.autologgin = false;

    if($location.$$url.indexOf("autologin") != -1){

      $http.get(APIURL+'wp-admin/admin-ajax.php?action=ic_auto_login&autologin='+$location.$$url.split("autologin=")[1]).then(function(res){
        
        if(res['data']['status'] === 'Error'){
          $rootScope.show_alert_toggle({'st':'error', 'msg':res['data']['msg']});
          $("#login").modal('show');
          return;
        }

        $rootScope.show_alert_toggle({'st':'success', 'msg': 'Aulogged successfully'});

        $scope.login_callback(res);

        $scope.autologgin = true;

      });
    } else{
      $("#login").modal('show');
    }

    $scope.login_callback = function(res){
      $rootScope.user = res['data']['data'];
      

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
    };

    $scope.luser = {};

    $scope.login = function(){
      $http.get(APIURL+'wp-admin/admin-ajax.php?action=ic_endorser_login', $scope.luser).then(function(res){
        
        if(res['data']['status'] === 'Error'){
          $rootScope.show_alert_toggle({'st':'error', 'msg':res['data']['msg']});
          $("#login").modal('show');
          return;
        }

        $rootScope.show_alert_toggle({'st':'success', 'msg': 'Logged in successfully'});

        $scope.login_callback(res);

      });
    };

    $scope.reuser = {};

    $scope.register = function(){
      $http.get(APIURL+'wp-admin/admin-ajax.php?action=ic_endorser_register', $scope.reuser).then(function(res){
        
        if(res['data']['status'] === 'Error'){
          $rootScope.show_alert_toggle({'st':'error', 'msg':res['data']['msg']});
          $("#register").modal('show');
          return;
        }

        $rootScope.show_alert_toggle({'st':'success', 'msg': 'Register successfully, wait for admin approval, you will receive autologin details in your email'});


      });
    };

    $scope.ruser = {};

    $scope.resetPassword = function(){
      $http.get(APIURL+'wp-admin/admin-ajax.php?action=ic_endorser_reset_password&id='+$rootScope.user['ID'], $scope.ruser).then(function(res){
        
        if(res['data']['status'] === 'Error'){
          $rootScope.show_alert_toggle({'st':'error', 'msg':res['data']['msg']});
          return;
        }

        $rootScope.show_alert_toggle({'st':'success', 'msg': 'Password Reset, Log in with new password'});

        $("#login").modal('show');

      });
    };


      /************************ SOCIAL SHARE ******************************/

    $scope.open_preview = function(data){
      var newWin = open('preview.html','Preview', "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=560, height=700, top=100, left=400");
      temp = data.mailtemplate.replace('[NOTES]', data.notes);

      $http.get(APIURL+'?action=ic_get_template_style').then(function(res){
        console.log(res);
        var pdata = {content: temp, style: res.css};
        newWin.postMessage(pdata, window.location.origin);
      });
      

    };

    $scope.social_share_obj = {fb: 'fbShare', 'li': 'linkedInShare', 'tw': 'twitterShare'}

		$scope.success_callback = function(resp, type){
      console.log(resp, type);
      data = {
        endorser_id: $rootScope.user.endorser.ID,
        points: 25,
        type: type + 'Share',
        notes: ''
      };
      $http.post(APIURL+'wp-admin/admin-ajax.php?action=ic_add_points', data, {headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(res){
        $rootScope.user.points = res.data.total_points;
      });
    };

    $scope.error_callback = function(resp, type){
      console.log(resp, type);
    };

    $scope.social_share = function(type){

      if(type === 'tw') {
        SocialShare[$scope.social_share_obj[type]]($rootScope.user[type+'_ref_link'], $rootScope.user['twitter_text'], $scope.success_callback, $scope.error_callback);
      } else {
        SocialShare[$scope.social_share_obj[type]]($rootScope.user[type+'_ref_link'], $scope.success_callback, $scope.error_callback);
      }
    };

    $scope.invitation_contacts_list = [];
    $scope.contact = {};
    $scope.click =0;
    $scope.add_invitation = function(fl){
      if(fl) {
        $scope.invitation_contacts_list.push({name: $scope.contact.name, email: $scope.contact.email});
        $scope.contact = {};
        $scope.click =0;
      }
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

    $scope.send_invitation = function(){
      if($scope.invitation_contacts_list.length){

        $http.post(APIURL+'wp-admin/admin-ajax.php?action=ic_send_endorsement_invitation', 
          {id: $rootScope.user.endorser.ID, template:$rootScope.user.notes, contacts: $scope.invitation_contacts_list},
         {headers:{'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(res){

          $scope.invitation_contacts_list = [];
          $("#myModal").modal('hide');

          $rootScope.show_alert_toggle({'st':'success', 'msg': 'Invitation send successfully'});

        });
        

      } else {
        $rootScope.show_alert_toggle({'st':'error', 'msg': 'No Contacts found. Please add to send invitation'});
      }
    };



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

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};
 
fiapp.directive("compareTo", compareTo);