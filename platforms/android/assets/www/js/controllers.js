var appController = angular.module('starter.controllers', []);

    appController.controller('AppCtrl', function($scope,$ionicPlatform, $ionicModal, $timeout,$state) {
        $ionicPlatform.ready(function() {
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
            $scope.sideMenuLists = [
                {sideMenuName:"Home",url:"#/app/home"},
                {sideMenuName:"Challenges & Contests",url:"#/app/challengelist"},
                {sideMenuName:"Food Festivals",url:"#/app/festivalList"},
                {sideMenuName:"Influencers",url:"#/app/influencersList"},
                {sideMenuName:"Shop",url:""},
                {sideMenuName:"Blog",url:"#/app/blog"},
                {sideMenuName:"About",url:"#/app/about"},
                {sideMenuName:"Settings",url:"#/app/settings"}
            ];
            $scope.goToPage = function($index){

                $state.go($scope.sideMenuLists[$index].url);
            }
        });

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
        .controller('mapCtrl', function($scope,$ionicPlatform,$ionicNavBarDelegate,$timeout,$stateParams,addMarker) {
            $ionicPlatform.ready(function() {
                console.log($stateParams.longitude + " "+ $stateParams.latitude);
                var map = null
                $scope.goBack = function(){

                    $ionicNavBarDelegate.back();
                };
                var locations = [{longitude:$stateParams.longitude,latitude:$stateParams.latitude, title:"mapTitle"},{longitude:-85.70089,latitude:38.16110, title:"second"}];
                $timeout(function() {
                    var div = document.getElementById("gMap");
                    map = plugin.google.maps.Map.getMap(div);
                    map.clear();
                    map.setClickable(true);
                    /*var latlng = new plugin.google.maps.LatLng($stateParams.latitude,$stateParams.longitude);
                    console.log(latlng);
                    map.addMarker(
                        {
                            'position':latlng,
                            'title':"This is a test"

                        },function(marker){
                            console.log("marker added");
                            marker.showInfoWindow();
                        });*/
                    var test =  addMarker.addMarkerList(map,locations);
                }, 1000);

            });
        })
    .controller('PlaylistCtrl', function($scope, $stateParams) {
    })

        .controller('checkLocationCtrl', function($scope, $state, $location,$ionicPlatform,SessionService,$ionicSideMenuDelegate,$ionicLoading,countryList) {
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
                $ionicLoading.show({
                 template: '<i class=""></i>Loading...'
                 });

                console.log("IN CONTROLLER: "+JSON.stringify(list));
                $scope.countryList = [
                    {countryName:"Abilene, TX" ,longitude:"0",latitude:"0"},
                    {countryName:"Akron / Canton",longitude:"1",latitude:"1"},
                    {countryName:"Albany  / Capital Region",longitude:"2",latitude:"2"},
                    {countryName:"Albuquerque",longitude:"3",latitude:"3"},
                    {countryName:"Allentown /Reading",longitude:"4",latitude:"4"},
                    {countryName:"Amarillo",longitude:"5",latitude:"5"},
                    {countryName:"Anchorage",longitude:"6",latitude:"6"},
                    {countryName:"Anchorage",longitude:"7",latitude:"7"}

                ];
                var list = countryList.setList();
                list.then(function(result){
                    console.log(JSON.stringify(result.data));
                    $scope.countryList =  result.data;
                });

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
                    SessionService.set('current_user_latitude',position.coords.longitude);
                    console.log(SessionService.get('current_user_longitude'));
                    $ionicLoading.hide();
                    startRedirecting();
                };

    // onError Callback receives a PositionError object
    //
                function onError(error) {
                    console.log(error);
                    $ionicLoading.hide();
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
                    if ("geolocation" in navigator){


                        navigator.geolocation.getCurrentPosition(onSuccess, onError);
                    }
                    else{

                        console.log("geolocation off");
                        //$ionicLoading.hide();
                    }
                }
                $scope.myForm = {};
                $scope.data = {};

                var utils = {
                    submitForm:function(){
                        SessionService.set('current_user_city',$scope.data.city);
                        SessionService.set('current_user_state',$scope.data.state);
                        SessionService.set('current_user_country',$scope.data.country);
                        //$location.path('/login');
                       // $state.go('/login','slide');
                        $state.go('login');
                        //$location.path('/login')
                    },
                    test:function(){
                        console.log("Clicked");

                    }

                };
                /*$scope.$watch('data.locationDetails',function(oldValue,newValue){
                    //alert(newValue);
                    if (newValue != oldValue && newValue != null){
                        $scope.data = newValue;
                        alert('clicked');
                        utils.submitForm();
                    }


                });*/
                $scope.locationChanged = function(selected){
                   console.log(selected.longitude);
                   $scope.data.state = selected.state;
                    $scope.data.city = selected.city;
                    $scope.data.country = selected.country;
                    utils.submitForm();
                };
                $scope.test = utils.test;

                //checkConnection();
                /*var div = document.getElementById("map_canvas");
                 map = plugin.google.maps.Map.getMap(div);
                 */
            });


    })
    .controller('LoginCtrl', ['$scope', 'Auth', '$location', '$ionicPlatform','StorageService','$ionicModal','$ionicPopup','$ionicActionSheet','SessionService','countryList',
            function($scope, Auth, $location, $ionicPlatform, StorageService,$ionicModal,$ionicPopup,$ionicActionSheet,SessionService,countryList) {
        $ionicPlatform.ready(function() {
            window.scope = $scope;
            $scope.credentials = {username: "", password: ""};
            $scope.userData = {};
            $scope.countryList = [];
            var list = countryList.setList();
            list.then(function(result){
                console.log(JSON.stringify(result.data));
                $scope.countryList =  result.data;
            });


            $scope.selectedCity = SessionService.get('current_user_city');
            $scope.locationChange = function (city){
                console.log(city);
                $scope.userData.city = city.city;
                $scope.userData.state = city.state;
                $scope.userData.country = city.country;
            };
            var imageURI = null;
            $ionicModal.fromTemplateUrl('templates/registerUser.html', {
                scope: $scope
            }).then(function(modal) {
                    $scope.modal = modal;
                });
            var takePicture = function(){
                navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            };
            var chooseFromGallery = function(){
                navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                });
            };
            function onSuccess(imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
                imageURI = imageData;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
            var modalOptions = {
                showActions:function(){
                   $ionicActionSheet.show({
                        buttons: [
                            { text: 'Camera' },
                            { text: 'Gallery' }
                        ],

                        titleText: 'Upload Picture',
                        cancelText: 'Cancel',
                        cancel: function() {

                            // add cancel code..
                        },
                        buttonClicked: function(index) {
                            if (index == 0){
                                takePicture();
                            }
                            else if (index == 1){
                                chooseFromGallery();
                            }
                            console.log(index);
                            return true;
                        }
                    });

                },
                submit:function(){
                    console.log("USERDATA: "+JSON.stringify($scope.userData));
                    if ($scope.userData.registerForm.$valid){
                        if ($scope.userData.conf == $scope.userData.password){
                            console.log(JSON.stringify($scope.userData));
                        }
                        else{
                            console.log("Passwords dont match");
                        }
                    }
                    else{
                        console.log("Error");
                    }

                }
            };
            // Triggered in the login modal to close it
            $scope.modalActions = modalOptions;
            $scope.closeLogin = function() {
                $scope.modal.hide();
            };
            var utils = {
                createNewUser:function(){
                    console.log('here');

                    $scope.modal.show();
                },
                signIn:function(){
                    console.log("Credentials: "+$scope.credentials);
                    Auth.login($scope.credentials).success(function(data){
                        if (data.status == 'success'){
                            var storage = StorageService.get('hungryAuth');
                            console.log("auth_token "+JSON.parse(storage).auth_token);
                            $location.path('/app/home');
                        }
                        else{
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error!',
                                template: data.data.error_msg
                            });
                            alertPopup.then(function(res) {
                                console.log('Thank you for not eating my delicious ice cream cone');
                            });
                        }
                    });

                    //$location.path('/app/home');
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
            window.scope = $scope;
            var options = {
                date: new Date(),
                mode: 'date'
            };
// calling show() function with options and a result handler
            datePicker.show(options, function(date){
                console.log("date result " + date);
            });
        });


    }])

    .controller('homeCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate) {
        $ionicPlatform.ready(function() {
            var map = null;
            window.scope = $scope;
            $scope.toggleRight = function() {
                alert('RightMenu');
                $ionicSideMenuDelegate.toggleRight();
            };
            $timeout(function() {
                var div = document.getElementById("mapView");
                map = plugin.google.maps.Map.getMap(div);
                map.clear()
                map.setClickable(true);

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
            var init = function (){
                document.getElementById('leftSideMenu').style.visibility = "hidden";
                if (map != null){
                    map.setClickable(true);
                }
            }
            init();
        });
    }])
    .controller('challengeListCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate) {
        $ionicPlatform.ready(function() {
            window.scope = $scope;
            $scope.toggleSideMenu = function(){

                if ($ionicSideMenuDelegate.isOpenLeft()){

                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    //map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{


                    document.getElementById('leftSideMenu').style.visibility = "visible";
                   // map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();

                }

            };
        });
    }])
        .controller('festivalListCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate) {
            $ionicPlatform.ready(function() {
                window.scope = $scope;
                $scope.toggleSideMenu = function(){

                    if ($ionicSideMenuDelegate.isOpenLeft()){

                        document.getElementById('leftSideMenu').style.visibility = "hidden";
                        //map.setClickable(true);
                        $ionicSideMenuDelegate.toggleRight();
                    }
                    else{


                        document.getElementById('leftSideMenu').style.visibility = "visible";
                        //map.setClickable(false);
                        $ionicSideMenuDelegate.toggleLeft();

                    }

                };
            });
        }])
        .controller('influencerListCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate) {
            $ionicPlatform.ready(function() {
                window.scope = $scope;
                $scope.toggleSideMenu = function(){

                    if ($ionicSideMenuDelegate.isOpenLeft()){

                        document.getElementById('leftSideMenu').style.visibility = "hidden";
                        //map.setClickable(true);
                        $ionicSideMenuDelegate.toggleRight();
                    }
                    else{


                        document.getElementById('leftSideMenu').style.visibility = "visible";
                        //map.setClickable(false);
                        $ionicSideMenuDelegate.toggleLeft();

                    }

                };
            });
        }])
        .controller('aboutCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate) {
            $ionicPlatform.ready(function() {
                window.scope = $scope;
                $scope.toggleSideMenu = function(){

                    if ($ionicSideMenuDelegate.isOpenLeft()){

                        document.getElementById('leftSideMenu').style.visibility = "hidden";
                        //map.setClickable(true);
                        $ionicSideMenuDelegate.toggleRight();
                    }
                    else{


                        document.getElementById('leftSideMenu').style.visibility = "visible";
                        //map.setClickable(false);
                        $ionicSideMenuDelegate.toggleLeft();

                    }

                };
            });
        }])
        .controller('settingsCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','$ionicModal' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,$ionicModal) {
            $ionicPlatform.ready(function() {
                window.scope = $scope;
                $ionicModal.fromTemplateUrl('templates/editProfile.html', {
                    scope: $scope
                }).then(function(modal) {
                        $scope.modal = modal;
                    });

                // Triggered in the login modal to close it
                $scope.closeLogin = function() {
                    $scope.modal.hide();
                };
                var utils = {
                    editUser:function(){
                        console.log('here');
                        $scope.modal.show();
                    }

                };
                $scope.editProfile = utils.editUser;

                $scope.toggleSideMenu = function(){

                    if ($ionicSideMenuDelegate.isOpenLeft()){

                        document.getElementById('leftSideMenu').style.visibility = "hidden";
                        //map.setClickable(true);
                        $ionicSideMenuDelegate.toggleRight();
                    }
                    else{


                        document.getElementById('leftSideMenu').style.visibility = "visible";
                        //map.setClickable(false);
                        $ionicSideMenuDelegate.toggleLeft();

                    }

                };
            });
        }])
        .controller('blogListCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate' ,function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate) {
            $ionicPlatform.ready(function() {
                window.scope = $scope;
                var subMenuList = [
                    {subMenuName:"TOP STORIES"},
                    {subMenuName:"CATEGORIES"}
                ];
                $scope.selected = 0;
                $scope.subMenuList = subMenuList;
                $scope.selectBlog = function(index){
                    $scope.selected = index;
                }
                $scope.toggleSideMenu = function(){

                    if ($ionicSideMenuDelegate.isOpenLeft()){

                        document.getElementById('leftSideMenu').style.visibility = "hidden";
                        //map.setClickable(true);
                        $ionicSideMenuDelegate.toggleRight();
                    }
                    else{


                        document.getElementById('leftSideMenu').style.visibility = "visible";
                        //map.setClickable(false);
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
            $scope.selected = 0;
            $scope.selectMenu = function(index){
              $scope.selected = index;
            };
            var menuC = [
                {menuName:"DETAILS"},
                {menuName:"PRIZE"},
                {menuName:"STATS"},
                {menuName:"MORE INFO"}
            ];
            var menuFest = [
                {menuName:"DETAILS"},
                {menuName:"MORE INFO"}
            ];
            var contest={
                titleClass : "hcontestgreen",
                dateClass : "conDateG",
                timeClass : "",
                addressClass : "conAdsG",
                priceClass : "conTag",
                mapClass : "mapIt4Green mapIt4contest",
                otherClass: "srhDirHead tRts conlftBrd",
                eventInfoIcon: "evtInfo5",
                eventInfoDistance: "evtInfo6",
                timeEnabled: "false",
                priceEnabled: "true"
            };
            var challenge={
                titleClass : "hcongreen",
                dateClass : "othDateG",
                timeClass : "othalmG",
                addressClass : "othAdsG",
                priceClass : "pTag",
                mapClass : "mapIt4Green",
                otherClass: "srhDirHead tRts lftBrd",
                eventInfoIcon: "evtInfo3",
                eventInfoDistance: "evtInfo4",
                timeEnabled: "true",
                priceEnabled: "true"
            };
            var festival={
                titleClass : "hcon",
                dateClass : "othDate",
                timeClass : "",
                addressClass : "othAds",
                priceClass : "",
                mapClass : "mapIt",
                otherClass: "srhDirHead tRts",
                eventInfoIcon: "evtInfo1",
                eventInfoDistance: "evtInfo2",
                timeEnabled: "false",
                priceEnabled: "false"
            };
            console.log("id: "+$stateParams.id + " type: "+$stateParams.type);
            if ($stateParams.type == "contest"){
                $scope.styleClass = contest;
                $scope.menus = menuC;
            }else if ($stateParams.type == "challenge"){
                $scope.styleClass = challenge;
                $scope.menus = menuC;
            }else{
                $scope.styleClass = festival;
                $scope.menus = menuFest;
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

