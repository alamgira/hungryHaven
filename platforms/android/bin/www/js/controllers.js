var appController = angular.module('starter.controllers', ['ngSanitize']);

appController.controller('AppCtrl', function($scope,$ionicPlatform, $ionicModal, $timeout,$state,User,definedVariable,$ionicSideMenuDelegate) {
    $ionicPlatform.ready(function() {
        // Form data for the login modal
        $ionicSideMenuDelegate.canDragContent(false);
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
        if (User.getUserInfo().length > 0){
            $scope.userInfo = User.getUserInfo()[0];

        }else{
            User.getUserInfo().then(function(response){
               $scope.userInfo = response[0];

            });
        }
        $scope.$watch(function(){
            return $ionicSideMenuDelegate.getOpenRatio();
        }, function(newValue, oldValue) {
            if (newValue == 0){
                $scope.hideLeft = true;
            } else{
                $scope.hideLeft = false;
            }
        });
        $scope.$on('user:updated', function(event,data) {
            // you could inspect the data to see if what you care about changed, or just update your own scope
            $scope.userInfo = User.getUserInfo()[0];
        });
        $scope.adminUrl = definedVariable.getAdminRootClean();
        //$scope.userInfo = User.getUserInfo();

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {


            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            var time = $timeout(function() {
                $scope.closeLogin();
            }, 1000);

        };
        $scope.sideMenuLists = [
            {sideMenuName:"Home",url:"#/app/home"},
            {sideMenuName:"Challenges & Contests",url:"#/app/challengelist"},
            //{sideMenuName:"Food Festivals",url:"#/app/festivalList"},
            {sideMenuName:"Influencers",url:"#/app/influencersList"},
            //{sideMenuName:"Shop",url:""},
            {sideMenuName:"Blog",url:"#/app/blog"},
            {sideMenuName:"About",url:"#/app/about"},
            {sideMenuName:"Settings",url:"#/app/settings"}
        ];
        $scope.goToPage = function($index){

            $state.go($scope.sideMenuLists[$index].url);
        };


    });

})


    .controller('mapCtrl', function($scope,$ionicPlatform,$ionicNavBarDelegate,$timeout,$stateParams,addMarker,ChallengeList) {
        $ionicPlatform.ready(function() {
            document.getElementById('leftSideMenu').style.visibility = "hidden";

            var map = null;
            $scope.goBack = function(){
                $timeout.cancel(time);
                $ionicNavBarDelegate.back();
            };
            var currentIndex = $stateParams.currentIndex;
            var currentList = ChallengeList.getCurrentList()[currentIndex];
            var locations = [currentList];
            var latitude = currentList.latitude;
            var longitude = currentList.longitude;
            $scope.openWebView = function(target){
                console.log("ADDR : "+JSON.stringify(currentList));
                var address = currentList.street +"," +currentList.city + ","+currentList.state + ","+currentList.country;
                var link = "http://maps.apple.com/?daddr="+address;

                var ref = window.open(link, '_system', 'location=no');
            };
            $scope.challengeName = currentList.challenge_name;
           // var locations = [{longitude:$stateParams.longitude,latitude:$stateParams.latitude, title:"mapTitle"},{longitude:-85.70089,latitude:38.16110, title:"second"}];
            var time = $timeout(function() {
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
   /* .controller('PlaylistCtrl', function($scope, $stateParams) {
    })
*/
    .controller('checkLocationCtrl', function($scope, $state, $location,$ionicPlatform,SessionService,$ionicSideMenuDelegate,$ionicLoading,countryList,Auth) {
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

            var loggedIn = Auth.isLoggedIn();


            // $scope.submit = utils.submitForm;


            window.scope = $scope;
            $ionicLoading.show({
                template: '<i class=""></i>Loading...'
            });

            if (loggedIn != null && loggedIn.auth_token !== 'undefined'){

                 Auth.checkLogin({authToken:String(loggedIn.auth_token)}).then(function(data){

                     if (data.data.status == "success"){

                        $location.path('/app/home');
                     }else{

                        Auth.logout();
                     }

                 },function(error){


                 });
                /*if (!Auth.checkLogin({authToken:String(loggedIn.auth_token)})){
                 Auth.logout();
                 }else{
                 $location.path('/app/home');
                 }*/

            }else{

            }
            //console.log("IN CONTROLLER: "+JSON.stringify(list));
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

                $scope.countryList =  result.data;
            });

            function startRedirecting(){

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
                SessionService.set('current_user_latitude',position.coords.latitude);


                $ionicLoading.hide();
                startRedirecting();
            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {

                $ionicLoading.hide();
            }
            $scope.toggleSideMenu = function(){

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
                    if (loggedIn.auth_token !== 'undefined'){
                        console.log("AUTH TOKEN SET : "+loggedIn.auth_token);
                        var promise = Auth.checkLogin({authToken:String(loggedIn.auth_token)}).then(function(data){

                            if (data){
                                $location.path('/app/home');
                            }else{
                                Auth.logout();
                            }
                            return data;
                        },function(error){
                            return error;
                        });
                        /*if (!Auth.checkLogin({authToken:String(loggedIn.auth_token)})){
                         Auth.logout();
                         }else{
                         $location.path('/app/home');
                         }*/

                    }else{

                    }

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

                $scope.data.state = selected.state;
                $scope.data.city = selected.city;
                $scope.data.country = selected.country;
                utils.submitForm();
            };
            $scope.test = utils.test;
            $ionicLoading.hide();
            //checkConnection();
            /*var div = document.getElementById("map_canvas");
             map = plugin.google.maps.Map.getMap(div);
             */
        });


    })
    .controller('LoginCtrl', ['$scope', 'Auth', '$location', '$ionicPlatform','StorageService','$ionicModal','$ionicPopup','$ionicActionSheet','SessionService','countryList','$ionicLoading','$ionicPopup',
        function($scope, Auth, $location, $ionicPlatform, StorageService,$ionicModal,$ionicPopup,$ionicActionSheet,SessionService,countryList,$ionicLoading,$ionicPopup) {
            $ionicPlatform.ready(function() {

                window.scope = $scope;
                $scope.credentials = {username: "", password: ""};
                $scope.userData = {};
                $scope.reset = {};
                $scope.countryList = [];
                var list = countryList.setList();
                list.then(function(result){

                    $scope.countryList =  result.data;
                });


                $scope.selectedCity = SessionService.get('current_user_city');
                $scope.locationChange = function (city){

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

                $ionicModal.fromTemplateUrl('templates/forgot_password.html', {
                    scope: $scope
                }).then(function(modal) {
                        $scope.resetModal = modal;
                    });
                var takePicture = function(){
                    navigator.camera.getPicture(onSuccess, onFail, {
                        quality: 50,
                        destinationType: Camera.DestinationType.FILE_URI
                    });
                };
                var chooseFromGallery = function(){
                    navigator.camera.getPicture(onSuccess, onFail, {
                        quality: 50,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY      // 0:Photo Library, 1=Camera, 2=Saved Photo Album

                    });
                };
                function onSuccess(FILE_URI) {
                    var image = document.getElementById('myImage');
                    //image.src = "data:image/jpeg;base64," + imageData;
                    image.src = FILE_URI;
                    imageURI = FILE_URI;
                    Auth.upload_profile_pic(imageURI);

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

                                return true;
                            }
                        });

                    },
                    reset:function(){
                        if ($scope.reset.registerForm.$valid){
                            Auth.changePassword($scope.reset).then(function(response){
                                console.log("RESPONSE "+JSON.stringify(response));
                                if (response.status == "success"){
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Success!',
                                        template: response.response
                                    });
                                    alertPopup.then(function(res) {
                                        $scope.resetModal.hide();
                                    });
                                }else{
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error!',
                                        template: response.response
                                    });
                                    alertPopup.then(function(res) {

                                    });
                                }
                            });
                        }else{
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error!',
                                template: "INVALID"
                            });
                            alertPopup.then(function(res) {

                            });
                        }
                    },
                    submit:function(){
                       // dataService.upload_profile_pic(imageURI);

                        if ($scope.userData.registerForm.$valid){
                            if ($scope.userData.conf == $scope.userData.password){
                                $ionicLoading.show({
                                    template: '<i class=""></i>Loading...'
                                });
                                if (imageURI != null){
                                    $scope.userData.media_id = Auth.getPicId();
                                    Auth.register($scope.userData).then(function(response){

                                        if (response.data.status == "success"){
                                            StorageService.set('hungryAuth',JSON.stringify({auth_token:response.data.auth_token}));
                                            $ionicLoading.hide();
                                            utils.registrationSuccessfull();
                                        }else{

                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error!',
                                                template: response.data.response
                                            });
                                            alertPopup.then(function(res) {
                                                $ionicLoading.hide();
                                            });
                                        }
                                    });
                                }else{
                                    Auth.register($scope.userData).then(function(response){
                                        if (response.data.status == "success"){
                                            StorageService.set('hungryAuth',JSON.stringify({auth_token:response.data.auth_token}));
                                            utils.registrationSuccessfull();
                                        }
                                        else{
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error!',
                                                template: response.data.response
                                            });
                                            alertPopup.then(function(res) {
                                                $ionicLoading.hide();
                                            });
                                        }
                                    });
                                }
                            }
                        }else{
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error!',
                                template: "Please check all your fields"
                            });
                            alertPopup.then(function(res) {
                                $ionicLoading.hide();
                            });
                        }
                        $ionicLoading.hide();
                    }
                };
                // Triggered in the login modal to close it
                $scope.modalActions = modalOptions;
                $scope.closeLogin = function() {
                    $scope.modal.hide();
                };

                var utils = {
                    createNewUser:function(){
                        $scope.modal.show();
                    },
                    registrationSuccessfull:function(){
                        $scope.modal.hide();
                        $location.path('/app/home');

                    },
                    forget_password:function(){
                        $scope.resetModal.show();
                    },
                    signIn:function(){
                        $ionicLoading.show({
                            template: '<i class=""></i>Loading...'
                        });
                        Auth.login($scope.credentials).success(function(data){
                            if (data.status == 'success'){
                                $ionicLoading.hide();
                                $location.path('/app/home');
                            }
                            else{
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error!',
                                    template: data.data.error_msg
                                });
                                alertPopup.then(function(res) {
                                    $ionicLoading.hide();
                                });
                            }
                        });

                        //$location.path('/app/home');
                    },
                    fbSignIn:function(){
                        facebookConnectPlugin.login(["public_profile","email","user_location"],
                            fbLoginSuccess,
                            function (error) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error!',
                                    template: error
                                });
                                alertPopup.then(function(res) {

                                });
                            }
                        );
                        //facebookConnectPlugin.getLoginStatus(statusSucess,statusError);
                        /*facebookConnectPlugin.login(["public_profile"],
                            fbLoginSuccess,
                            function (error) {
                                alert("" + error);
                            }
                        );*/
                        //facebookConnectPlugin.logout(fbLoginSuccess , function(error){alert(error);});
                    }
                };
                var statusSucess = function(userData){
                    //console.log("UserData "+JSON.stringify(userData));
                    if (userData.status == "connected"){
                        var longitude = SessionService.get('current_user_longitude');
                        var latitude = SessionService.get('current_user_latitude');
                        facebookConnectPlugin.getAccessToken(function(token){
                            var response = Auth.fb_login({token:token,longitude:longitude,latitude:latitude}).then(function(response){
                                console.log("FB RESPONSE "+JSON.stringify(response));
                                if (response.status == "success"){
                                    StorageService.set('hungryAuth',JSON.stringify({auth_token:response.response.auth_token}));
                                    $location.path('/app/home')
                                }
                            });
                        });
                        //var response = Auth.fb_login(userData);
                    }else{
                        facebookConnectPlugin.login(["public_profile","email","user_location"],
                            fbLoginSuccess,
                            function (error) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error!',
                                    template: error
                                });
                                alertPopup.then(function(res) {

                                });
                            }
                        );
                    }
                };
                var statusError = function(err){
                    facebookConnectPlugin.login(["public_profile","email","user_location"],
                        fbLoginSuccess,
                        function (error) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error!',
                                template: error
                            });
                            alertPopup.then(function(res) {

                            });
                        }
                    );
                };
                var fbLoginSuccess = function (userData) {
                    var longitude = SessionService.get('current_user_longitude');
                    var latitude = SessionService.get('current_user_latitude');
                    facebookConnectPlugin.getAccessToken(function(token){
                        $ionicLoading.show({
                            template: '<i class=""></i>Loading...'
                        });
                        var response = Auth.fb_login({token:token,longitude:longitude,latitude:latitude}).then(function(response){

                            if (response.status == "success"){
                                StorageService.set('hungryAuth',JSON.stringify({auth_token:response.response.auth_token}));
                                $ionicLoading.hide();
                                $location.path('/app/home')
                            }else{
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error!',
                                    template: response.response.response
                                });
                                alertPopup.then(function(res) {

                                });

                            }
                        });
                    });
                };

                $scope.goToRegistration = utils.createNewUser;
                $scope.signInUser = utils.signIn;
                $scope.fbSignIn = utils.fbSignIn;
                $scope.forgot_password = utils.forget_password;
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

            });
        });


    }])

    .controller('homeCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','dataService','Auth' ,'definedVariable','ChallengeList','countryList','addMarker',
        '$ionicModal','User','adMobHelper','$ionicScrollDelegate',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,dataService,Auth,definedVariable,ChallengeList,countryList,addMarker,$ionicModal,User,adMobHelper,$ionicScrollDelegate) {
        $ionicPlatform.ready(function() {
            /*
                Admob setup goes here
             */
            var AdMob;
            var createBanner = function(){
                if (window.AdMob ){

                    var admobid = ( /(android)/i.test(navigator.userAgent) ) ? adMobHelper.getAndroid() : adMobHelper.getIos();
                    AdMob = window.AdMob;

                    AdMob.createBanner({
                            adId: admobid.banner,
                            adSize:AdMob.SMART_BANNER,
                            position:AdMob.AD_POSITION.BOTTOM_CENTER,
                            overlap: true,
                            autoShow:true
                        },
                        function(){console.log("Success Ad");},
                        function(error){console.log("Error ad: "+error);}
                    )
                }
            };

            createBanner();


           /* var initAd = function(){
                var defaultOptions = {
                    // bannerId: admobid.banner,
                    // interstitialId: admobid.interstitial,
                    // adSize: 'SMART_BANNER',
                    // width: integer, // valid when set adSize 'CUSTOM'
                    // height: integer, // valid when set adSize 'CUSTOM'
                    position: AdMob.AD_POSITION.BOTTOM_CENTER,
                    // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
                    bgColor: 'black', // color name, or '#RRGGBB'
                    // x: integer,		// valid when set position to 0 / POS_XY
                    // y: integer,		// valid when set position to 0 / POS_XY
                    isTesting: true // set to true, to receiving test ad for testing purpose
                    // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
                };
                AdMob.setOptions( defaultOptions );

            };
            var createBanner = function(){
                if(AdMob) AdMob.createBanner( {
                    adId:admobid.banner,
                    position:AdMob.AD_POSITION.BOTTOM_CENTER,
                    autoShow:true}

                );
            };*/

            /*
            Admob ends
            */
            $ionicSideMenuDelegate.canDragContent(false);
            var map = null;


            window.scope = $scope;
            /*THIS IS THE BASIC CATEGORY LIST*/
            $scope.filterList = definedVariable.getFilterList();
            $scope.showFilterSelected = 0;
            var changeFilter = function(index){
                $scope.showFilterSelected = index;
                if (index == 0){
                    $scope.challengeList = ChallengeList.getList();
                }else if (index == 1){
                    utils.getChallengeOnly();
                }else if (index == 2){
                    utils.getContestOnly();
                }else if (index == 3){
                    utils.getFestivalOnly();
                }
            };
            /*Basic Category Ends*/
            var filterIconList = [
                {not_selected:"img/all-inactive@3x.png" , selected:"img/all-active@3x.png"},
                {not_selected:"img/challenges-inactive@3x.png" , selected:"img/challenges-active@3x.png"},
                {not_selected:"img/contests-inactive@3x.png" , selected:"img/contests-active@3x.png"},
                {not_selected:"img/festivals-inactive@3x.png", selected:"img/festivals-active@3x.png"},
                {not_selected:"img/more-inactive@3x.png", selected:"img/more-active@3x.png"}
            ];
            $scope.fTest = filterIconList;
            var delegate = $ionicScrollDelegate.$getByHandle('small');
            var scroll_position = 0;
            $scope.filSel = 0;

            var startAtX = 0;
            $scope.getXStart = function(){
                return startAtX;
            }
            $scope.clickFilter = function($index){
                if ($index == 4){
                    $scope.showFilterDetail();
                }else{
                    $scope.filSel = $index;
                    startAtX = (100*$index);
                    delegate.scrollTo(100*$scope.filSel,0,true);
                    var time = $timeout(function() {
                        $scope.showFilterStatus = false;
                        return true;
                    }, 1000);
                }


            };

            $scope.showFilterStatus = false;
            $scope.showFilter = function(){

                delegate.scrollTo(100*$scope.filSel, 0 , false);
                if ($scope.showFilterStatus == false){

                    $scope.showFilterStatus = true;

                    if (map != null){
                        map.setClickable(false);
                    }
                }
                else{
                    $scope.showFilterStatus = false;

                    if (map != null){
                        map.setClickable(true);
                    }
                }
            };
            $scope.testSwipe = function(){

                scroll_position = delegate.getScrollPosition().left;
                if (scroll_position < 60 ){
                    $scope.filSel = 0;
                }else if (scroll_position >60 && scroll_position<140){
                    $scope.filSel = 1;
                }else if (scroll_position > 140 && scroll_position < 240){
                    $scope.filSel = 2;
                }else{
                    $scope.filSel = 3;
                }

                /*else if (scroll_position > 240 && scroll_position < 340){
                    $scope.filSel = 3;
                }else{
                    $scope.filSel = 4;
                }*/
                if ($scope.filSel < 4 && $scope.showFilterStatus == true){
                    startAtX = (100*$scope.filSel);
                    delegate.scrollTo(100*$scope.filSel, 0 , true);
                    changeFilter($scope.filSel);

                }else if ($scope.filSel == 4 && $scope.showFilterStatus == true){
                    delegate.scrollTo(100*$scope.filSel, 0 , true);
                    var time = $timeout(function() {
                        $scope.showFilterDetail();
                        return true;
                    }, 1000);
                    //
                }
              // alert("INSIDE TEST SWIPE " + JSON.stringify(delegate.getScrollPosition()));

            };

            var filterSelected = 0;

            /*this section is for tag filter*/
            var taglist = dataService.getTags();
            if (taglist.length >= 0){
                $scope.tagList = taglist;
            }else{
                taglist.then(function(response){

                    $scope.tagList = response;
                });
            }
            $scope.tagForChallenge = [];
            var tagForChallenge = dataService.getTagForChallenge();
            if (tagForChallenge.length >=0){
                $scope.tagForChallenge = tagForChallenge;
            }else{
                tagForChallenge.then(function(response){
                    $scope.tagForChallenge = response;
                });
            }

            /*Tag Filter Complete*/


            /*SUB CATEGORY FUNCTION BEGINS*/
            var subCatList = dataService.getSubCat();

            if (subCatList.length >= 0){
                $scope.subCatList = subCatList;
            }else{
                subCatList.then(function(response){

                    $scope.subCatList = response;
                });
            }

            var subCatForChallenge = dataService.getSubCatForChallenge();
            if (subCatForChallenge.length >=0){
                $scope.subCatForChallenge = subCatForChallenge;
            }else{
                subCatForChallenge.then(function(response){
                    $scope.subCatForChallenge = response;
                })
            }

            /*Sub Category Function Ends*/

            $scope.filterTagList = [];
            $scope.filterCategoryList = [];
            $scope.filterSubCategoryList = [];
            // Triggered in the login modal to close it


            /* THIS IS FOR SIDE MENU BEGIN*/
            $scope.toggleRight = function() {
                alert('RightMenu');
                $ionicSideMenuDelegate.toggleRight();
            };
            /*Side menu function ends*/

            var modalOptions = {
                closeModal:function(){
                    if (map != null){
                        map.setClickable(true);
                    }
                    $scope.modal.hide();
                },
                filterTags:function(tag){
                    User.setTagFilters(tag);
                },
                filterSubCat:function(subCat){
                    User.setSubCatFilters(subCat);
                },
                tagSelectClass:function(tag){
                    var styleClass= 'button button-light';

                    var tempFilteredTag = User.getTagFilters();
                    angular.forEach(tempFilteredTag,function(value,key){
                        if (tag.tag_id === value.tag_id){
                            styleClass =  'button button-assertive';
                            return;
                        }
                    });
                    return styleClass;
                },
                subCatSelectClass:function(tag){
                    var styleClass= 'button button-light';

                    var tempFilteredTag = User.getSubCatFilters();
                    angular.forEach(tempFilteredTag,function(value,key){

                        if (tag.sub_id === value.sub_id){

                            styleClass =  'button button-assertive';
                        }
                    });
                    return styleClass;
                }
            };
            $scope.modalActions = modalOptions;

            var time = $timeout(function() {
                var div = document.getElementById("mapView");
                map = plugin.google.maps.Map.getMap(div);
                map.clear();
                map.setClickable(true);
                utils.insertMarker();
                return true;
            }, 1000);

            var list = countryList.setList();
            list.then(function(result){

                $scope.countryList =  result.data;
            });
            $scope.toggleSideMenu = function(){
                if ($ionicSideMenuDelegate.isOpenLeft())
                {
                    //AdMob.showBanner();
                    createBanner();
                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{
                    //AdMob.hideBanner();
                    AdMob.removeBanner();

                    document.getElementById('leftSideMenu').style.visibility = "visible";
                    map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();
                }
            };
            $scope.showFilterDetail = function(){
                if(map != null){
                    map.setClickable(false);
                }
                $scope.showFilterStatus = false;
                $scope.modal.show();
            };

            var utils = {
                //All List
                insertMarker:function(){

                    if (map != null){
                        if (addMarker.addMarkerList(map,$scope.challengeList)){
                            $timeout.cancel(time);
                        }
                    }
                },
                getChallengeList: function(inputs){
                    var challList = dataService.getChallengeList(inputs);



                        if (challList.length != 'undefined' && challList.length >= 0){
                            $scope.challengeList = challList;

                        }
                        else{

                            challList.then(function(response){

                                $scope.challengeList = response;
                            });
                        }
                        // $scope.challengeList = challList;




                    //return JSON.stringify(dataService.getChallengeList(inputs));
                },
                getChallengeOnly:function(){
                    $scope.challengeList = ChallengeList.getChallengeList();
                },
                getContestOnly:function(){
                    $scope.challengeList = ChallengeList.getContestList();
                },
                getFestivalOnly:function(){
                    $scope.challengeList = ChallengeList.getFestivalList();
                },
                getTags:function(){
                    $scope.tagList = User.getTags();
                }
            };
            var loggedIn = Auth.isLoggedIn();
            var init = function (){
                document.getElementById('leftSideMenu').style.visibility = "hidden";
                if (map != null){
                    map.setClickable(true);
                }

                var inputs = {auth_token:loggedIn.auth_token,category_type:''};

                $scope.admin = definedVariable.getAdminRootClean();
                $scope.filterList = definedVariable.getFilterList();
                utils.getChallengeList(inputs);
               // initAd();
               // createBanner();
               // console.log(utils.getChallengeList(''));
            }
            init();

            $scope.changeCity = function(city){

                var newCountry = dataService.get_challenge_list_by_location({
                    city:city.city,
                    state:city.state,
                    country:city.country,
                    auth_token:loggedIn.auth_token,
                    category_type:''
                });
                newCountry.then(function(response){

                    $scope.challengeList = response;
                });
            };


            //$scope.filterFunction = utils.filterTagFunction;
            $ionicModal.fromTemplateUrl('templates/sort.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                    $scope.modal = modal;
            });
            $scope.$watch('challengeList',function(newValue,oldValue){

                if (map != null && newValue!= oldValue){
                    if (addMarker.addMarkerList(map,newValue)){

                    }
                    else{
                        console.log("RETURN FALSE");
                    }
                }
            });
           // $timeout(utils.insertMarker(),5000);
            //$scope.challengeList = utils.getChallengeList(inputs);
        });
    }])
    .controller('challengeListCtrl',['$scope','Auth','countryList','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','definedVariable','dataService','$ionicModal','User','adMobHelper','ChallengeList',
        function($scope,Auth,countryList, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,definedVariable,dataService,$ionicModal,User,adMobHelper,ChallengeList) {
        $ionicPlatform.ready(function() {

            window.scope = $scope;
            /*this section is for tag filter*/
            var AdMob;
            var createBanner = function(){
                if (window.AdMob ){
                    console.log("I AM IN HERE window plugin");
                    var admobid = ( /(android)/i.test(navigator.userAgent) ) ? adMobHelper.getAndroid() : adMobHelper.getIos();
                    AdMob = window.AdMob;

                    AdMob.createBanner({
                            adId: admobid.banner,
                            position:AdMob.AD_POSITION.BOTTOM_CENTER,
                            overlap: true,
                            autoShow:true
                        },
                        function(){console.log("Success Ad");},
                        function(error){console.log("Error ad: "+error);}
                    )
                }
            };

            /**
             * Geolocation
             * @param position
             */
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
                SessionService.set('current_user_latitude',position.coords.latitude);

            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {

            }
            if ("geolocation" in navigator){


                navigator.geolocation.getCurrentPosition(onSuccess, onError);
            }
            createBanner();
            var taglist = dataService.getTags();
            if (taglist.length >= 0){
                $scope.tagList = taglist;
            }else{
                taglist.then(function(response){
                    $scope.tagList = response;
                });
            }
            $scope.tagForChallenge = [];
            var tagForChallenge = dataService.getTagForChallenge();
            if (tagForChallenge.length >=0){
                $scope.tagForChallenge = tagForChallenge;
            }else{
                tagForChallenge.then(function(response){
                    $scope.tagForChallenge = response;
                });
            }

            /*Tag Filter Complete*/


            /*SUB CATEGORY FUNCTION BEGINS*/
            var subCatList = dataService.getSubCat();

            if (subCatList.length >= 0){
                $scope.subCatList = subCatList;
            }else{
                subCatList.then(function(response){

                    $scope.subCatList = response;
                });
            }

            var subCatForChallenge = dataService.getSubCatForChallenge();
            if (subCatForChallenge.length >=0){
                $scope.subCatForChallenge = subCatForChallenge;
            }else{
                subCatForChallenge.then(function(response){
                    $scope.subCatForChallenge = response;
                })
            }

            /*Sub Category Function Ends*/
            /*This is modal functions*/
            var modalOptions = {
                closeModal:function(){
                    $scope.modal.hide();
                },
                filterTags:function(tag){
                    User.setTagFilters(tag);
                },
                filterSubCat:function(subCat){
                    User.setSubCatFilters(subCat);
                },
                tagSelectClass:function(tag){
                    var styleClass= 'button button-light';
                    var tempFilteredTag = User.getTagFilters();
                    angular.forEach(tempFilteredTag,function(value,key){
                        if (tag.tag_id === value.tag_id){
                            styleClass =  'button button-assertive';
                            return;
                        }
                    });
                    return styleClass;
                },
                subCatSelectClass:function(tag){
                    var styleClass= 'button button-light';

                    var tempFilteredTag = User.getSubCatFilters();
                    angular.forEach(tempFilteredTag,function(value,key){

                        if (tag.sub_id === value.sub_id){

                            styleClass =  'button button-assertive';
                        }
                    });
                    return styleClass;
                }
            };
            $scope.modalActions = modalOptions;

            /*Modal function ends*/


            var list = countryList.setList();
            if (list.length !="undefined" && list.length >= 0){
                $scope.countryList = list;
            }else{
                list.then(function(result){

                    $scope.countryList =  result.data;
                });
            }

            var loggedIn = Auth.isLoggedIn();
            var utils = {
                //All List

                getChallengeList: function(inputs){
                    var challList = dataService.getChallengeList(inputs);


                    if (challList.length != 'undefined' && challList.length >= 0){
                        $scope.challengeList = challList;

                    }
                    else{
                        //$scope.challengeList = challList;
                        challList.then(function(response){

                            $scope.challengeList = response;
                        });
                    }
                    // $scope.challengeList = challList;


                    //return JSON.stringify(dataService.getChallengeList(inputs));
                },
                getChallengeOnly:function(){
                    $scope.challengeList = ChallengeList.getChallengeList();
                },
                getContestOnly:function(){
                    $scope.challengeList = ChallengeList.getContestList();
                },
                getFestivalOnly:function(){
                    $scope.challengeList = ChallengeList.getFestivalList();
                }
            };
            var init = function (){
                document.getElementById('leftSideMenu').style.visibility = "hidden";


                var inputs = {auth_token:loggedIn.auth_token,category_type:''};

                $scope.admin = definedVariable.getAdminRootClean();
                $scope.filterList = definedVariable.getFilterList();
                utils.getChallengeList(inputs);



                // console.log(utils.getChallengeList(''));
            }
            init();
            $scope.changeCity = function(city){

                var newCountry = dataService.get_challenge_list_by_location({
                    city:city.city,
                    state:city.state,
                    country:city.country,
                    auth_token:loggedIn.auth_token,
                    category_type:''
                });
                newCountry.then(function(response){

                    $scope.challengeList = response;

                });

            };

            $scope.showFilterSelected = 0;
            $scope.changeFilter = function(index){
                $scope.showFilterSelected = index;
                if (index == 0){
                    $scope.challengeList = ChallengeList.getList();
                }else if (index == 1){
                    utils.getChallengeOnly();
                }else if (index == 2){
                    utils.getContestOnly();
                }else if (index == 3){
                    utils.getFestivalOnly();
                }

            };
            $scope.showFilterDetail = function(){
                $scope.modal.show();
            };
            $scope.showFilterStatus = false;
            $scope.showFilter = function(){
                if ($scope.showFilterStatus == false){
                    $scope.showFilterStatus = true;
                }
                else{
                    $scope.showFilterStatus = false;
                }
            };
            $ionicModal.fromTemplateUrl('templates/sort.html', {
                scope: $scope
            }).then(function(modal) {
                    $scope.modal = modal;
                });

            $scope.$watch('challengeList',function(newValue,oldValue){

            });

            $scope.toggleSideMenu = function(){

                if ($ionicSideMenuDelegate.isOpenLeft()){
                    createBanner();
                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    //map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{
                    AdMob.removeBanner();
                    document.getElementById('leftSideMenu').style.visibility = "visible";
                    // map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();

                }

            };
        });
    }])
    .controller('festivalListCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','ChallengeList' ,
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,ChallengeList) {
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
            var utils = {
                getFestival : function(){
                    $scope.festivalList = ChallengeList.getFestivalList();
                }
            };

            var init = function(){
                utils.getFestival();
            };
            init();
        });
    }])
    .controller('influencerListCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','dataService','definedVariable','adMobHelper',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,dataService,definedVariable,adMobHelper) {
        $ionicPlatform.ready(function() {
            window.scope = $scope;
            var AdMob;
            var createBanner = function(){
                if (window.AdMob ){
                    console.log("I AM IN HERE window plugin");
                    var admobid = ( /(android)/i.test(navigator.userAgent) ) ? adMobHelper.getAndroid() : adMobHelper.getIos();
                    AdMob = window.AdMob;

                    AdMob.createBanner({
                            adId: admobid.banner,
                            position:AdMob.AD_POSITION.BOTTOM_CENTER,
                            overlap: true,
                            autoShow:true
                        },
                        function(){console.log("Success Ad");},
                        function(error){console.log("Error ad: "+error);}
                    )
                }
            };

            createBanner();
            $scope.toggleSideMenu = function(){

                if ($ionicSideMenuDelegate.isOpenLeft()){
                    createBanner();
                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    //map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{
                    AdMob.removeBanner();
                    document.getElementById('leftSideMenu').style.visibility = "visible";
                    //map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();

                }

            };
            var influencerList = dataService.getInfluencers();
            if (influencerList.length >=0){
                $scope.influencerList = influencerList;
            }else{
                influencerList.then(function(response){
                    $scope.influencerList = response;
                });
            }
            var init = function(){
                $scope.admin = definedVariable.getAdminRootClean();
            };
            init();
        });
    }])
    .controller('influencerDetailsCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','$ionicNavBarDelegate','dataService','definedVariable',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,$ionicNavBarDelegate,dataService,definedVariable) {
        $ionicPlatform.ready(function() {
            window.scope = $scope;
            $scope.goBack = function(){
                $ionicNavBarDelegate.back();
            };
            $scope.openWebView = function(link,target){
                var ref = window.open(link, target, 'location=yes');
            };
            var index = $stateParams.id;
            var influencerList = dataService.getInfluencers();
            var influencer_id;
            if (influencerList.length >=0){
                $scope.influencers = influencerList[index];
                influencer_id = $scope.influencers.id;
            }else{
                influencerList.then(function(response){
                    $scope.influencers = response[index];
                    influencer_id = $scope.influencers.id;
                });
            }

            var influencer_video = dataService.getInfluencersVideoById(influencer_id);

            influencer_video.then(function(response){

               $scope.influencerVideo = response;
            });


            $scope.admin = definedVariable.getAdminRootClean();
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
    .controller('aboutCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','adMobHelper' ,
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,adMobHelper) {
        $ionicPlatform.ready(function() {
            window.scope = $scope;
            var AdMob;
            var createBanner = function(){
                if (window.AdMob ){
                    console.log("I AM IN HERE window plugin");
                    var admobid = ( /(android)/i.test(navigator.userAgent) ) ? adMobHelper.getAndroid() : adMobHelper.getIos();
                    AdMob = window.AdMob;

                    AdMob.createBanner({
                            adId: admobid.banner,
                            position:AdMob.AD_POSITION.BOTTOM_CENTER,
                            autoShow:true
                        },
                        function(){console.log("Success Ad");},
                        function(error){console.log("Error ad: "+error);}
                    )
                }
            };

            createBanner();
            $scope.toggleSideMenu = function(){

                if ($ionicSideMenuDelegate.isOpenLeft()){
                    createBanner();
                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    //map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{
                    AdMob.removeBanner();
                    document.getElementById('leftSideMenu').style.visibility = "visible";
                    //map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();

                }

            };
        });
    }])
    .controller('settingsCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','$ionicModal','Auth' ,
        '$location','$ionicActionSheet','countryList','User','definedVariable','dataService','adMobHelper','ChallengeList','blogList','influencerList','$ionicPopup',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,$ionicModal,Auth,$location,$ionicActionSheet,countryList,User,
                 definedVariable,dataService,adMobHelper,ChallengeList,blogList,influencerList,$ionicPopup) {
        $ionicPlatform.ready(function() {


            window.scope = $scope;
            var AdMob;
            var createBanner = function(){
                if (window.AdMob ){
                    console.log("I AM IN HERE window plugin");
                    var admobid = ( /(android)/i.test(navigator.userAgent) ) ? adMobHelper.getAndroid() : adMobHelper.getIos();
                    AdMob = window.AdMob;

                    AdMob.createBanner({
                            adId: admobid.banner,
                            position:AdMob.AD_POSITION.BOTTOM_CENTER,
                            overlap: true,
                            autoShow:true
                        },
                        function(){console.log("Success Ad");},
                        function(error){console.log("Error ad: "+error);}
                    )
                }
            };

            createBanner();
            $scope.updated = {};
            $scope.admin = definedVariable.getAdminRootClean();
            $scope.countryList = [];
            var image_updated = false;
            var list = countryList.setList();
            list.then(function(result){

                $scope.countryList =  result.data;
            });
            $scope.userData = {};
            var user = User.getUserInfo();
            if (user.length >= 0){
                $scope.userData = user[0];
            }else{
                user.then(function(result){
                   $scope.userData = result[0];
                });
            }

            var imageURI = null;
            var takePicture = function(){
                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.FILE_URI
                });
            };
            var chooseFromGallery = function(){
                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY      // 0:Photo Library, 1=Camera, 2=Saved Photo Album

                });
            };
            function onSuccess(FILE_URI) {
                var image = document.getElementById('myImage');
                //image.src = "data:image/jpeg;base64," + imageData;
                image.src = FILE_URI;
                imageURI = FILE_URI;
                Auth.upload_profile_pic(imageURI);
                image_updated = true;
            }
            function onFail(message) {

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

                            return true;
                        }
                    });

                },
                updateUserAction:function(){
                    console.log(dataService.get_auth_token().auth_token);
                    var loggedIn = Auth.isLoggedIn();
                    $scope.updated.auth_token = loggedIn.auth_token;
                    if (Auth.getPicId() != null){
                        $scope.updated.pic_id = Auth.getPicId();
                    }

                    var p = Auth.update_user($scope.updated).then(function(result){

                       if (result){
                           var promise = User.refreshUserInfo().then(function(response){
                               return true;
                           });
                           if (promise && ChallengeList.clearMemory() && blogList.clearMemory() && influencerList.clearMemory()){
                               var alertPopup = $ionicPopup.alert({
                                   title: 'Success!',
                                   template: "Profile Updated"
                               });
                               alertPopup.then(function(res) {
                                   $scope.modal.hide();
                               });

                           }
                           //$scope.modal.hide();
                       }else{
                           var alertPopup = $ionicPopup.alert({
                               title: 'Error',
                               template: "Something went wrong"
                           });
                           alertPopup.then(function(res) {

                           });

                       }
                        return true;
                    });

                },
                updatePassword:function(){
                    var loggedIn = Auth.isLoggedIn();
                    $scope.updated.auth_token = loggedIn.auth_token;
                    if (typeof $scope.updated.password != 'undefined' && typeof $scope.updated.conf_pass != 'undefined'
                        && $scope.updated.password == $scope.updated.conf_pass){
                        Auth.changePassword($scope.updated).then(function(result){
                            if (result && ChallengeList.clearMemory() && blogList.clearMemory() && influencerList.clearMemory()){
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success!',
                                    template: "Password Updated"
                                });
                                alertPopup.then(function(res) {
                                    $scope.modal.hide();
                                });
                            }else{
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: "Something went wrong"
                                });
                                alertPopup.then(function(res) {

                                });
                            }
                        });
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: "Something went wrong"
                        });
                        alertPopup.then(function(res) {

                        });
                    }

                },
                locationChange: function (city){

                    $scope.updated.city = city.city;
                    $scope.updated.state = city.state;
                    $scope.updated.country = city.country;
                }
            };

            $scope.modalActions = modalOptions;

            $ionicModal.fromTemplateUrl('templates/editProfile.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function() {
                if (image_updated){
                    var promise = User.refreshUserInfo().then(function(response){
                        $scope.modal.hide();
                    });
                }else{
                    $scope.modal.hide();
                }
                createBanner()

            };
            var utils = {
                editUser:function(){
                    $scope.updated = {};
                    console.log('here');
                    $scope.editSelected = "profile";
                    AdMob.removeBanner();
                    $scope.modal.show();
                },
                editPassword:function(){
                    $scope.updated = {};
                    $scope.editSelected = "password";
                    AdMob.removeBanner();
                    $scope.modal.show();
                },
                logout:function(){
                    if (Auth.logout() && User.emptyUser() && ChallengeList.clearMemory() && blogList.clearMemory() && influencerList.clearMemory()){
                        AdMob.removeBanner();
                        $location.path('/');
                    }

                }

            };
            $scope.editProfile = utils.editUser;
            $scope.editPassword = utils.editPassword;
            $scope.signout = utils.logout;
            $scope.toggleSideMenu = function(){

                if ($ionicSideMenuDelegate.isOpenLeft()){
                    createBanner();
                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    //map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{
                    AdMob.removeBanner();
                    document.getElementById('leftSideMenu').style.visibility = "visible";
                    //map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();

                }

            };
        });
    }])
    .controller('blogListCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','dataService','definedVariable','adMobHelper',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,dataService,definedVariable,adMobHelper) {
        $ionicPlatform.ready(function() {
            window.scope = $scope;
            var AdMob;
            var createBanner = function(){
                if (window.AdMob ){
                    console.log("I AM IN HERE window plugin");
                    var admobid = ( /(android)/i.test(navigator.userAgent) ) ? adMobHelper.getAndroid() : adMobHelper.getIos();
                    AdMob = window.AdMob;

                    AdMob.createBanner({
                            adId: admobid.banner,
                            position:AdMob.AD_POSITION.BOTTOM_CENTER,
                            overlap: true,
                            autoShow:true
                        },
                        function(){console.log("Success Ad");},
                        function(error){console.log("Error ad: "+error);}
                    )
                }
            };

            createBanner();
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
                    createBanner();
                    document.getElementById('leftSideMenu').style.visibility = "hidden";
                    //map.setClickable(true);
                    $ionicSideMenuDelegate.toggleRight();
                }
                else{
                    AdMob.removeBanner();
                    document.getElementById('leftSideMenu').style.visibility = "visible";
                    //map.setClickable(false);
                    $ionicSideMenuDelegate.toggleLeft();

                }

            };
            var utils = {
                getBlogList : function(){
                    var blogList = dataService.getBlog();

                    if (blogList.length >=0){
                        $scope.blogList = blogList;
                    }else{
                        blogList.then(function(response){
                            $scope.blogList = response;
                        });
                    }

                }
            }
            var init = function(){
                utils.getBlogList();
                $scope.admin = definedVariable.getAdminRootClean();
            }
            init();


        });
    }])
    .controller('settingsDetailCtrl',['$scope','$stateParams','$ionicPlatform','$ionicNavBarDelegate',
        function($scope, $stateParams,$ionicPlatform,$ionicNavBarDelegate) {
        $ionicPlatform.ready(function() {
            window.scope = $scope;
            $scope.goBack = function(){
                $ionicNavBarDelegate.back();
            };

            var type = $stateParams.type;
            var privacy = {title:"Privacy Policy",sub_title:"Privacy Hungry Haven", content:"PRIVACY CONTENT"};
            var terms = {title:"Terms and conditions",sub_title:"Terms Hungry Haven", content:"Terms CONTENT"};
            if (type == "privacy"){
                $scope.details = privacy;
            }else if (type == "terms"){
                $scope.details = terms;
            }
        });
    }])
    .controller('detailsCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicNavBarDelegate','ChallengeList' ,'definedVariable','$ionicActionSheet',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicNavBarDelegate,ChallengeList,definedVariable,$ionicActionSheet) {
        $ionicPlatform.ready(function() {

            $scope.goBack = function(){
                $ionicNavBarDelegate.back();
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
            var utils = {
                getChallengeList: function(){
                    return ChallengeList.getCurrentList();

                    //return JSON.stringify(dataService.getChallengeList(inputs));
                },
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

                            return true;
                        }
                    });

                }
            };
                $scope.challengeList = null;
            var list = null;
            var init = function (){
                list = utils.getChallengeList();


                $scope.challengeList = list[$stateParams.id];
                $scope.selectedDetails = list[$stateParams.id].detail;
                $scope.selectedCategory = list[$stateParams.id].category_name;
                $scope.admin = definedVariable.getAdminRootClean();
                $scope.currentChallengeIndex = $stateParams.id;
                $scope.challenges = list;

                // console.log(utils.getChallengeList(''));
            };
            init();
            $scope.share = function(){
                var pic = null;
                var url = "https://www.facebook.com/hungry.haven";
                var message = list[$stateParams.id].challenge_name + "\n" + list[$stateParams.id].short_detail+"\n";
                window.plugins.socialsharing.available(function(isAvailable) {
                    if (isAvailable) {
                        // use a local image from inside the www folder:
//      window.plugins.socialsharing.share('Some text', 'Some subject', null, 'http://www.nu.nl');
//      window.plugins.socialsharing.share('Some text');
                        if (list[$stateParams.id].pic_url != null){
                            pic = definedVariable.getAdminRootClean() + list[$stateParams.id].pic_url;
                        }

//      window.plugins.socialsharing.share('test', null, 'data:image/png;base64,R0lGODlhDAAMALMBAP8AAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAUKAAEALAAAAAAMAAwAQAQZMMhJK7iY4p3nlZ8XgmNlnibXdVqolmhcRQA7', null, function(e){alert("success: " + e)}, function(e){alert("error: " + e)});
                        window.plugins.socialsharing.share(message, list[$stateParams.id].category_name, pic, url, null, null);
                        // alternative usage:

                        // 1) a local image from anywhere else (if permitted):
                        // window.plugins.socialsharing.share('Some text', 'http://domain.com', '/Users/username/Library/Application Support/iPhone/6.1/Applications/25A1E7CF-079F-438D-823B-55C6F8CD2DC0/Documents/.nl.x-services.appname/pics/img.jpg');

                        // 2) an image from the internet:
//      window.plugins.socialsharing.share('Some text', "Some subject', 'http://domain.com', 'http://domain.com/image.jpg');

                        // 3) text and link:
//      window.plugins.socialsharing.share('Some text and a link', '', '', 'http://www.nu.nl');
                    }
                });
            };
            $scope.selected = 0;
            $scope.selectMenu = function(index){
                $scope.selected = index;
                if (menuC[index].menuName == "DETAILS"){
                    $scope.selectedDetails = list[$stateParams.id].detail;
                }else if (menuC[index].menuName == "PRIZE"){

                    $scope.selectedDetails = list[$stateParams.id].prize_details;
                }else if (menuC[index].menuName == "STATS"){
                    $scope.selectedDetails = list[$stateParams.id].success_text;
                }else if (menuC[index].menuName == "MORE INFO"){
                    $scope.selectedDetails = list[$stateParams.id].detail;

                }
                //$scope.$apply();
            };

            $scope.$watch('selectedDetails',function(newValue,oldValue){

            });
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
    .controller('blogDetailsCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicNavBarDelegate','dataService','definedVariable','$sanitize','$sce',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicNavBarDelegate,dataService,definedVariable,$sanitize,$sce) {
            $ionicPlatform.ready(function() {
                window.scope = $scope;

                $scope.blogId = $stateParams.id;

                $scope.goBack = function(){
                    $ionicNavBarDelegate.back();
                };
                /*$scope.toggleSideMenu = function(){

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

                };*/
                var utils = {
                    getBlogList : function(){
                        var blogList = dataService.getBlog();

                        if (blogList.length >=0){
                            $scope.blogList = blogList[$scope.blogId];
                            $scope.blogRelated = blogList;
                        }else{
                            blogList.then(function(response){
                                $scope.blogList = response[$scope.blogId];
                                $scope.blogRelated = response;

                            });
                        }

                    }
                }
                var init = function(){
                    utils.getBlogList();
                    $scope.admin = definedVariable.getAdminRootClean();
                }
                init();


            });
        }])
    .controller('feedbackCtrl', function($scope,$ionicPlatform,$ionicNavBarDelegate,Auth,dataService,$ionicPopup) {
        $ionicPlatform.ready(function() {
            document.getElementById('leftSideMenu').style.visibility = "hidden";
            var loggedIn = Auth.isLoggedIn();
            var auth_token = loggedIn.auth_token;
            $scope.goBack = function(){
                $ionicNavBarDelegate.back();
            };
            /*Model for feedback*/
            $scope.form_input = {};

            /*form submission with auth_token*/
            $scope.submit_feedback = function(){
                $scope.form_input.auth_token = auth_token;
                var promise = dataService.send_feedback($scope.form_input).then(function(response){
                    if (response.status == "success"){
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error!',
                            template: "Thank you for your response"
                        });
                        alertPopup.then(function(res) {
                            $ionicNavBarDelegate.back();
                        });

                    }
                });

            };


        });
    })
;

