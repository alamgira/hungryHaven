var appController = angular.module('starter.controllers', []);

appController.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

    .controller('checkLocationCtrl', function($scope, $state, $location,$ionicPlatform,SessionService,$ionicSideMenuDelegate) {
        function checkConnection() {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';

            if (states[networkState] != 'No network Connection'){
                return true;
            }
            return false;

        }
        $ionicPlatform.ready(function() {


            // $scope.submit = utils.submitForm;


            window.scope = $scope;
            function startRedirecting(){
                console.log("redirecting");
               // $location.path('/login');
                 $state.go('login');
            }
            function onSuccess(position) {
                /* alert('Latitude: '          + position.coords.latitude          + '\n' +
                 'Longitude: '         + position.coords.longitude         + '\n' +
                 'Altitude: '          + position.coords.altitude          + '\n' +
                 'Accuracy: '          + position.coords.accuracy          + '\n' +
                 'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                 'Heading: '           + position.coords.heading           + '\n' +
                 'Speed: '             + position.coords.speed             + '\n' +
                 'Timestamp: '         + position.timestamp                + '\n');

                 */
                SessionService.set('current_user_longitude',position.coords.longitude);
                console.log(SessionService.get('current_user_longitude'));
                startRedirecting();
            };

// onError Callback receives a PositionError object
//
            function onError(error) {
                alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');
            }
            $scope.toggleSideMenu = function(){
              alert('here');
                $ionicSideMenuDelegate.toggleLeft();
            };
            // $location.path('/login');
            if (!checkConnection()){
                navigator.app.exitApp();
            }
            else{
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }
            $scope.myForm = {};
            $scope.data = null;

            var utils = {
                submitForm:function(){
                    SessionService.set('current_user_locationDetails',$scope.data.locationDetails);
                    //$location.path('/login');
                   // $state.go('/login','slide');
                    $state.go('login');
                    //$location.path('/login')
                },
                test:function(){
                    console.log("Clicked");

                }

            };
            $scope.$watch('data.locationDetails',function(oldValue,newValue){
                alert(newValue);
                if (newValue != oldValue && newValue != null){
                    $scope.data = newValue;
                    alert('clicked');
                    utils.submitForm();
                }


            });

            //$scope.test = utils.test;

            //checkConnection();
            /*var div = document.getElementById("map_canvas");
             map = plugin.google.maps.Map.getMap(div);
             */
        });


})
.controller('LoginCtrl', ['$scope', 'Auth', '$location', '$ionicPlatform','SessionService','$ionicModal', function($scope, Auth, $location, $ionicPlatform, SessionService,$ionicModal) {
    $ionicPlatform.ready(function() {
        window.scope = $scope;
        $scope.credentials = {username: "", password: "", remember: ""};
        $scope.userData = {username: "", id: ""};

        $ionicModal.fromTemplateUrl('templates/registerUser.html', {
            scope: $scope
        }).then(function(modal) {
                $scope.modal = modal;
            });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };
        var utils = {
            createNewUser:function(){
                console.log('here');
                $scope.modal.show();
            },
            signIn:function(){
                console.log("Clicking Sign IN");
                $location.path('/app/home');
            }
        };
        $scope.goToRegistration = utils.createNewUser;
        $scope.signInUser = utils.signIn;
       /*$scope.loginUser = function() {

            angular.element('#error-message').hide();

            Auth.login({
                username: $scope.credentials.username,
                password: $scope.credentials.password,
                remember: $scope.credentials.remember
            }).success(function(data) {

                    if (data.error) {
                        angular.element('#error-message').show();
                    } else {
                        console.log("You are signed in!");
                        /*console.log($scope.userData);
                         $scope.userData.username = data.user.username;
                         $scope.userData.id = data.user.id;
                         console.log($scope.userData);*/
        /*        $scope.credentials = {};
                        $location.path('/');
                  }
                });
        };*/

    });

}])
    .controller('registerCtrl', ['$scope', 'Auth', '$location', '$ionicPlatform','SessionService','$stateParams', function($scope, Auth, $location, $ionicPlatform,SessionService,$stateParams) {
        $ionicPlatform.ready(function() {

        });


    }])

    .controller('homeCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate) {
        $ionicPlatform.ready(function() {

            $scope.toggleRight = function() {
                alert('RightMenu');
                $ionicSideMenuDelegate.toggleRight();
            };
            $timeout(function() {
                var div = document.getElementById("mapView");
                map = plugin.google.maps.Map.getMap(div);
            }, 1000);

            $scope.toggleSideMenu = function(){

                if ($ionicSideMenuDelegate.isOpenLeft()){

                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{


                    document.getElementById('leftSideMenu').style.visibility = "visible";
                    map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();

                }

            };

        });
    }])
    .controller('detailsCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicNavBarDelegate' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicNavBarDelegate) {
        $ionicPlatform.ready(function() {

            $scope.goBack = function(){
                $ionicNavBarDelegate.back();
            };
            var contest={
                titleClass : "hcontestgreen",
                dateClass : "conDateG",
                timeClass : "",
                addressClass : "conAdsG",
                priceClass : "conTag",
                mapClass : "mapIt4Green mapIt4contest"
            };
            var challenge={
                titleClass : "hcongreen",
                dateClass : "othDateG",
                timeClass : "othalmG",
                addressClass : "othAdsG",
                priceClass : "pTag",
                mapClass : "mapIt4Green"
            };
            var festival={
                titleClass : "hcon",
                dateClass : "othDate",
                timeClass : "",
                addressClass : "othAds",
                priceClass : "",
                mapClass : "mapIt"
            };
            console.log("id: "+$stateParams.id + " type: "+$stateParams.type);
            if ($stateParams.type == "contest"){
                $scope.styleClass = contest;
            }else if ($stateParams.type == "challenge"){
                $scope.styleClass = challenge;
            }else{
                $scope.styleClass = festival;
            }
            /*$scope.toggleRight = function() {
                alert('RightMenu');
                $ionicSideMenuDelegate.toggleRight();
            };
            $timeout(function() {
                var div = document.getElementById("mapView");
                map = plugin.google.maps.Map.getMap(div);
            }, 1000);

            $scope.toggleSideMenu = function(){

                if ($ionicSideMenuDelegate.isOpenLeft()){

                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{


                    document.getElementById('leftSideMenu').style.visibility = "visible";
                    map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();

                }

            };*/

        });
    }])
;

