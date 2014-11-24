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


    .controller('mapCtrl', function($scope,$ionicPlatform,$ionicNavBarDelegate,$timeout,$stateParams,addMarker,ChallengeList) {
        $ionicPlatform.ready(function() {
            document.getElementById('leftSideMenu').style.visibility = "hidden";

            var map = null;
            $scope.goBack = function(){

                $ionicNavBarDelegate.back();
            };
            var currentIndex = $stateParams.currentIndex;
            var currentList = ChallengeList.getCurrentList()[currentIndex];
            var locations = [currentList];
           // var locations = [{longitude:$stateParams.longitude,latitude:$stateParams.latitude, title:"mapTitle"},{longitude:-85.70089,latitude:38.16110, title:"second"}];
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

            console.log("Logged In : "+loggedIn);
            // $scope.submit = utils.submitForm;


            window.scope = $scope;
            $ionicLoading.show({
                template: '<i class=""></i>Loading...'
            });
            console.log("AUTH:::::"+JSON.stringify(loggedIn));
            if (loggedIn != null && loggedIn.auth_token !== 'undefined'){
                console.log("AUTH TOKEN SET : "+loggedIn.auth_token);
                 Auth.checkLogin({authToken:String(loggedIn.auth_token)}).then(function(data){
                     console.log("AUTH TOKEN + "+JSON.stringify(data));
                     if (data.data.status == "success"){
                         console.log("SUCCESS GOING IN");
                        $location.path('/app/home');
                     }else{
                         console.log("LOGIIN OUT ");
                        Auth.logout();
                     }

                 },function(error){
                     console.log("SOMETHING WENT WRONG : "+JSON.stringify(error));

                 });
                /*if (!Auth.checkLogin({authToken:String(loggedIn.auth_token)})){
                 Auth.logout();
                 }else{
                 $location.path('/app/home');
                 }*/

            }else{
                console.log("Looks fine");
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
                    if (loggedIn.auth_token !== 'undefined'){
                        console.log("AUTH TOKEN SET : "+loggedIn.auth_token);
                        var promise = Auth.checkLogin({authToken:String(loggedIn.auth_token)}).then(function(data){
                            console.log("AUTH TOKEN + "+JSON.stringify(data));
                            if (data){
                                $location.path('/app/home');
                            }else{
                                Auth.logout();
                            }
                            return data;
                        },function(error){
                            console.log("SOMETHING WENT WRONG : "+JSON.stringify(error));
                            return error;
                        });
                        /*if (!Auth.checkLogin({authToken:String(loggedIn.auth_token)})){
                         Auth.logout();
                         }else{
                         $location.path('/app/home');
                         }*/

                    }else{
                        console.log("Looks fine 2");
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
                console.log(selected.longitude);
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
    .controller('LoginCtrl', ['$scope', 'Auth', '$location', '$ionicPlatform','StorageService','$ionicModal','$ionicPopup','$ionicActionSheet','SessionService','countryList',
        function($scope, Auth, $location, $ionicPlatform, StorageService,$ionicModal,$ionicPopup,$ionicActionSheet,SessionService,countryList,dataService) {
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
                    //Auth.upload_profile_pic(imageURI);
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
                       // dataService.upload_profile_pic(imageURI);
                        if ($scope.userData.registerForm.$valid){
                            if ($scope.userData.conf == $scope.userData.password){

                               Auth.register($scope.userData).then(function(response){
                                   console.log("Register DATA: "+JSON.stringify(response.data));
                                    if (response.data.status == "success"){
                                        StorageService.set('hungryAuth',JSON.stringify({auth_token:response.data.auth_token}));
                                        utils.registrationSuccessfull();
                                    }
                                });

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
                    registrationSuccessfull:function(){
                        $scope.modal.hide();
                        $location.path('/app/home');

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

    .controller('homeCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','dataService','Auth' ,'definedVariable','ChallengeList','countryList','addMarker','$ionicModal','User',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,dataService,Auth,definedVariable,ChallengeList,countryList,addMarker,$ionicModal,User) {
        $ionicPlatform.ready(function() {

            var map = null;


            window.scope = $scope;
            /*THIS IS THE BASIC CATEGORY LIST*/
            $scope.filterList = definedVariable.getFilterList();
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
            /*Basic Category Ends*/


            /*this section is for tag filter*/
            var taglist = dataService.getTags();
            if (taglist.length >= 0){
                $scope.tagList = taglist;
            }else{
                taglist.then(function(response){
                    console.log("TAG LIST CONTROLLER : "+JSON.stringify(response));
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
                    console.log("sub cat LIST CONTROLLER : "+JSON.stringify(response));
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
                    console.log("CHANGING CLASS : "+JSON.stringify(tag));
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
                    console.log("CHANGING CLASS : "+JSON.stringify(tag));
                    var tempFilteredTag = User.getSubCatFilters();
                    angular.forEach(tempFilteredTag,function(value,key){
                        console.log("CHANGING CLASS TAG ID: "+tag.sub_id+ " FILTER TAG ID : "+value.sub_id);
                        if (tag.sub_id === value.sub_id){
                            console.log("CLASS MATCHED");
                            styleClass =  'button button-assertive';
                        }
                    });
                    return styleClass;
                }
            };
            $scope.modalActions = modalOptions;

            $timeout(function() {
                var div = document.getElementById("mapView");
                map = plugin.google.maps.Map.getMap(div);
                map.clear();
                map.setClickable(true);
                utils.insertMarker();

            }, 1000);
            var list = countryList.setList();
            list.then(function(result){
                console.log(JSON.stringify(result.data));
                $scope.countryList =  result.data;
            });
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
            $scope.showFilterDetail = function(){
                if(map != null){
                    map.setClickable(false);
                }
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
            var utils = {
                //All List
                insertMarker:function(){
                    console.log("TIMEOUT FUNCTION CALLED");
                    if (map != null){
                        if (addMarker.addMarkerList(map,$scope.challengeList))
                            console.log("Addming map for timeout");
                    }else{
                        console.log("MAP IS STILL NULL");
                    }
                },
                getChallengeList: function(inputs){
                    var challList = dataService.getChallengeList(inputs);
                    console.log("TYPE OF CHALL LIST: "+typeof challList);

                        console.log("CHeck Chall List: "+JSON.stringify(challList) + " length: "+challList.length);
                        if (challList.length != 'undefined' && challList.length >= 0){
                            $scope.challengeList = challList;

                        }
                        else{

                            challList.then(function(response){

                                $scope.challengeList = response;
                            });
                        }
                        // $scope.challengeList = challList;
                        console.log("Challenge List: "+$scope.challengeList);



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
                console.log("Input test: "+JSON.stringify(inputs));
                $scope.admin = definedVariable.getAdminRootClean();
                $scope.filterList = definedVariable.getFilterList();
                utils.getChallengeList(inputs);
               // console.log(utils.getChallengeList(''));
            }
            init();

            $scope.changeCity = function(city){
                console.log("CITY CHANGE : "+ JSON.stringify(city));
                var newCountry = dataService.get_challenge_list_by_location({
                    city:city.city,
                    state:city.state,
                    country:city.country,
                    auth_token:loggedIn.auth_token,
                    category_type:''
                });
                newCountry.then(function(response){
                    console.log("AFTER FUNCTION : "+JSON.stringify(response));
                    $scope.challengeList = response;
                });
            };
            //$scope.filterFunction = utils.filterTagFunction;
            $ionicModal.fromTemplateUrl('templates/sort.html', {
                scope: $scope
            }).then(function(modal) {
                    $scope.modal = modal;
            });
            $scope.$watch('challengeList',function(newValue,oldValue){
                console.log("WATCH IN PROGRESS: "+JSON.stringify(newValue));
                if (map != null && newValue!= oldValue){
                    if (addMarker.addMarkerList(map,newValue)){
                        console.log("RETURNED TRUE");
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
    .controller('challengeListCtrl',['$scope','Auth','countryList','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','definedVariable','dataService','$ionicModal','User',
        function($scope,Auth,countryList, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,definedVariable,dataService,$ionicModal,User) {
        $ionicPlatform.ready(function() {
            window.scope = $scope;
            /*this section is for tag filter*/
            var taglist = dataService.getTags();
            if (taglist.length >= 0){
                $scope.tagList = taglist;
            }else{
                taglist.then(function(response){
                    console.log("TAG LIST CONTROLLER : "+JSON.stringify(response));
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
                    console.log("sub cat LIST CONTROLLER : "+JSON.stringify(response));
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
                    console.log("CHANGING CLASS : "+JSON.stringify(tag));
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
                    console.log("CHANGING CLASS : "+JSON.stringify(tag));
                    var tempFilteredTag = User.getSubCatFilters();
                    angular.forEach(tempFilteredTag,function(value,key){
                        console.log("CHANGING CLASS TAG ID: "+tag.sub_id+ " FILTER TAG ID : "+value.sub_id);
                        if (tag.sub_id === value.sub_id){
                            console.log("CLASS MATCHED");
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
                    console.log(JSON.stringify(result.data));
                    $scope.countryList =  result.data;
                });
            }

            var loggedIn = Auth.isLoggedIn();
            var utils = {
                //All List

                getChallengeList: function(inputs){
                    var challList = dataService.getChallengeList(inputs);

                    console.log("CHeck Chall List: "+JSON.stringify(challList) + " length: "+challList.length);
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
                    console.log("Challenge List: "+$scope.challengeList);

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
                console.log("Input test: "+JSON.stringify(inputs));
                $scope.admin = definedVariable.getAdminRootClean();
                $scope.filterList = definedVariable.getFilterList();
                utils.getChallengeList(inputs);



                // console.log(utils.getChallengeList(''));
            }
            init();
            $scope.changeCity = function(city){
                console.log("CITY CHANGE : "+ JSON.stringify(city));
                var newCountry = dataService.get_challenge_list_by_location({
                    city:city.city,
                    state:city.state,
                    country:city.country,
                    auth_token:loggedIn.auth_token,
                    category_type:''
                });
                newCountry.then(function(response){
                    console.log("AFTER FUNCTION : "+JSON.stringify(response));
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
                console.log("WATCH IN PROGRESS: "+JSON.stringify(newValue));


            });

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
    .controller('influencerListCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','dataService','definedVariable',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,dataService,definedVariable) {
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
            $scope.openWebView = function(){
                var ref = window.open('http://www.justgfad.com', '_blank', 'location=yes');
            };
            var index = $stateParams.id;
            var influencerList = dataService.getInfluencers();
            if (influencerList.length >=0){
                $scope.influencers = influencerList[index];
            }else{
                influencerList.then(function(response){
                    $scope.influencers = response[index];
                });
            }
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
    .controller('settingsCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicSideMenuDelegate','$ionicModal','Auth' ,'$location',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicSideMenuDelegate,$ionicModal,Auth,$state) {
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
                },
                logout:function(){
                    if (Auth.logout()){
                        $state.go('checkLocation');
                    }
                }

            };
            $scope.editProfile = utils.editUser;
            $scope.signout = utils.logout;
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
    .controller('detailsCtrl',['$scope','$stateParams','$ionicPlatform','$timeout','$ionicNavBarDelegate','ChallengeList' ,'definedVariable',
        function($scope, $stateParams,$ionicPlatform,$timeout,$ionicNavBarDelegate,ChallengeList,definedVariable) {
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
                }
            };
                $scope.challengeList = null;
            var list = null;
            var init = function (){
                list = utils.getChallengeList();
                console.log("id: "+$stateParams.id + " type: "+$stateParams.type);
                console.log("LIst : "+JSON.stringify(list));
                $scope.challengeList = list[$stateParams.id];
                $scope.selectedDetails = list[$stateParams.id].detail;
                $scope.selectedCategory = list[$stateParams.id].category_name;
                $scope.admin = definedVariable.getAdminRootClean();
                $scope.currentChallengeIndex = $stateParams.id;
                $scope.challenges = list;
                // console.log(utils.getChallengeList(''));
            };
            init();
            $scope.selected = 0;
            $scope.selectMenu = function(index){
                $scope.selected = index;
                if (menuC[index].menuName == "DETAILS"){
                    $scope.selectedDetails = list[$stateParams.id].detail;
                }else if (menuC[index].menuName == "PRIZE"){
                    console.log("I AM HERE "+list[$stateParams.id].prize_details);

                    $scope.selectedDetails = list[$stateParams.id].prize_details;
                }else if (menuC[index].menuName == "STATS"){
                    $scope.selectedDetails = list[$stateParams.id].success_text;
                }else if (menuC[index].menuName == "MORE INFO"){
                    $scope.selectedDetails = list[$stateParams.id].detail;

                }
                //$scope.$apply();
            };

            $scope.$watch('selectedDetails',function(newValue,oldValue){
                console.log("WATCH IN PROGRESS: "+newValue+" "+ oldValue);
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
;

