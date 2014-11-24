'use strict';

myApp.factory('definedVariable',function(StorageService){
    return{
        getAdminRoot:function(){
            return "http://admin2.hungryhaven.com/index.php/";
        },
        getAdminRootClean:function(){
            return "http://admin2.hungryhaven.com";
        },
        getStorage:function(key){
            return StorageService.get(key);
        },
        getFilterList:function(){
            return [{filterType:"All"},{filterType:"Challenges"},{filterType:"Contest"},{filterType:"Festivals"}];
        }
    }
});
myApp.factory('Auth', function($http, $location, SessionService, StorageService,definedVariable){
    var adminRoot = definedVariable.getAdminRoot();
    var cacheSession = function(data) {
        SessionService.set('hungryAuth', JSON.stringify(data));
    };
    var uncacheSession = function() {
        SessionService.unset('hungryAuth');
    };
    var saveSession = function(data) {
        StorageService.set('hungryAuth', JSON.stringify(data));
    };
    var deleteSession = function() {
        StorageService.unset('hungryAuth');
    };
    var win = function(r){
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    };
    var fail = function(error){
        console.log("Error: "+JSON.stringify(error));
    };
    return {
        load: function() {
            return $http.get('/api/v1/auth');
        },
        logout: function() {
            //return $http.get('/auth/logout');
            ///var logout = $http.get(adminRoot + 'auth/logout');
            uncacheSession();
            deleteSession();
            //logout.success(uncacheSession, deleteSession);
            return true;
        },
        checkLogin:function(inputs){
            console.log("check login inputs: "+JSON.stringify(inputs));
            var promise = $http.post(adminRoot+'api/appLogin',inputs).then(function(response){
                console.log("I am here::::"+JSON.stringify(response));
                return response;
            },function(error){
                console.log("ERROR RESPONSE : "+JSON.stringify(error));
            });
           /* var promise = login.then(function(data){
                console.log("check login: "+JSON.stringify(data));
                return data;
            })*/
            return promise;
        },
        login: function(inputs) {
            //return $http.post('/auth/login', inputs);
            console.log("INPUTS: "+JSON.stringify(inputs))
            deleteSession();
            var login = $http.post(adminRoot + 'api/appLogin', inputs);
            login.success(function(data) {
                console.log('data: '+JSON.stringify(data));

                if (data.status == 'success'){

                    saveSession(data.data);


                }

                /*cacheSession(data);
                if(inputs.remember) {
                    console.log('remember this login');
                    saveSession(data);
                }*/
            });
            return login;
        },
        checkPassword: function(inputs) {
            var promise = $http.post(adminRoot + 'auth/password', inputs).then(function (response) {
                return response.data;
            });
            return promise;
        },
        changePassword: function(inputs) {
            var promise = $http.post(adminRoot + 'auth/changepassword', inputs).then(function (response) {
                return response.data;
            });
            return promise;
        },
        register: function(inputs) {

            var promise =  $http.post(adminRoot + 'api/appRegisterUser', inputs).then(function(response){
                return response;
            });
            return promise;

        },
        upload_profile_pic:function(imageURI){

            var options = new FileUploadOptions();
             options.fileKey="file";
             options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
             options.mimeType="image/jpeg";

            options.headers = {
                Connection:"close"
            };
             var params = {};
            params.fullPath = imageURI;
            params.name = options.fileName;

             options.params = params;
             options.chunkedMode = false;

             var ft = new FileTransfer();
             var url = adminRoot+'api/profileImageUpload';
             ft.upload(imageURI, url, win, fail, options,true);
        },
        locations: function() {
            return $http.get('/api/v1/auth/locations');
        },
        isLoggedIn: function() {
            //return $http.get('/auth/check');
            console.log("IS LOGGED IN HUNGRY AUTH: "+StorageService.get('hungryAuth'));
            return JSON.parse(StorageService.get('hungryAuth'));
        }
    }
});

myApp.factory('SessionService', function() {
    return {
        get: function(key) {
            return sessionStorage.getItem(key);
        },
        set: function(key, val) {
            return sessionStorage.setItem(key, val);
        },
        unset: function(key) {
            return sessionStorage.removeItem(key);
        }
    }
});
myApp.factory('StorageService', function() {
    return {
        get: function(key) {
            return localStorage.getItem(key);
        },
        set: function(key, val) {
            return localStorage.setItem(key, val);
        },
        unset: function(key) {
            return localStorage.removeItem(key);
        }
    }
});
myApp.factory('addMarker', function() {
    var currentMarkerList = [];
    var removeAllMarkers = function(){
        console.log("MARKER LIST LENGTH: "+currentMarkerList.length);
        if (currentMarkerList.length > 0 ){
            angular.forEach(currentMarkerList,function(value,key){
                console.log("MARKER : "+value);
                value.remove();
            });
            currentMarkerList = [];
        }



    };
    return {
        addMarkerList: function(map,list) {
            console.log("MAP LIST: "+JSON.stringify(list));
            if (map == null){
                console.log("MAP IS NULL");
            }else{
                console.log("MAP IS SET");
            }
            removeAllMarkers();
            if (list.length > 0){


                var latlng = null;
                var title,longitude,latitude,icon;
                var challenge_icon = "www/img/pin-challenges.png";
                var contest_icon = "www/img/pin-contest.png";
                var festiva_icon = "www/img/pin-festival.png";
                console.log("I AM HERE INSIDE ");
                angular.forEach(list,function(value,key){
                    console.log("INSIDE FOR EACH : "+JSON.stringify(value));
                    if (value.challenge_name != null){
                        title = value.challenge_name;
                    }
                    longitude = value.longitude;
                    latitude = value.latitude;
                    latlng = new plugin.google.maps.LatLng(latitude,longitude);
                    if (value.category_name == "challenge"){
                        icon = challenge_icon;
                    }else if(value.category_name == "contest"){
                        icon = contest_icon;
                    }else if (value.category_name == "festival"){
                        icon = festiva_icon;
                    }
                    map.addMarker(
                        {
                            'position':latlng,
                            'title':title,
                            'icon':icon

                        },function(marker){
                            marker.setIcon({
                                'url':icon,
                                'size':{
                                    'width': 32,
                                    'height':46
                                }
                            })
                            currentMarkerList.push(marker);
                            console.log("marker added");
                        });

                    //localStorage.getItem(key);


                });
                if (latlng != null){
                    map.animateCamera({
                        'target': latlng,
                        'zoom': 5,
                        'duration': 5000 // = 5 sec.
                    }, function() {
                        console.log("The animation is done");
                    });
                }


                return true;
            }else{
                console.log("I AM HERE in ELESES");
            }


            return false;

        }
    }
});

myApp.factory('dataService',function($http,definedVariable,ChallengeList){
    var adminRoot = definedVariable.getAdminRoot();
    var auth_token = definedVariable.getStorage('hungryAuth');
    var utils = {

    };

   return{
        get_auth_token:function(){
          return auth_token;
        },
        get_challenge_list_by_location:function(inputs){
            console.log("INPUT : "+JSON.stringify(inputs));
            var promise = $http.post(adminRoot + 'api/getChallenges', inputs).then(function (response) {
                console.log("Function Called to get challenges");
                console.log("STATUS RESPONSE: "+JSON.stringify(response));
                ChallengeList.setList(response.data.response);
                return ChallengeList.getList();
            });
            return promise;


        },
        getChallengeList:function(inputs){

            console.log("data service: "+JSON.stringify(inputs));

            if (ChallengeList.getList() == null){
                var promise = $http.post(adminRoot + 'api/getChallenges', inputs).then(function (response) {
                    console.log("Function Called to get challenges");
                    console.log("STATUS RESPONSE: "+JSON.stringify(response));

                        ChallengeList.setList(response.data.response);


                    return ChallengeList.getList();
                });
                return promise;
            }else{
                console.log("Challenge List already contains info: "+ChallengeList.getList());
                return ChallengeList.getList();
            }
        },
       getTags:function(){
            if (ChallengeList.getTagList() == null){
                var promise = $http.post(adminRoot+'api/getTags').then(function(response){
                    console.log("TAG LIST : "+JSON.stringify(response));
                    ChallengeList.setTagList(response.data.response);
                    return ChallengeList.getTagList();
                });
                return promise;
            }
            return ChallengeList.getTagList();

       },
       getTagForChallenge:function(){
            if (ChallengeList.getTagForChallenge() == null){
                var promise = $http.post(adminRoot+'api/get_tag_for_challenges').then(function(response){
                    ChallengeList.setTagForChallenge(response.data.response);
                    return ChallengeList.getTagForChallenge();
                })
                return promise;
            }
           return ChallengeList.getTagForChallenge();
       },
       getCategories:function(){
           if (ChallengeList.getCategoryList() == null){
               var promise = $http.post(adminRoot+'api/getCategories').then(function(response){
                   console.log("Category LIST : "+JSON.stringify(response));
                   ChallengeList.setCategoryList(response.data.response);
               });
               return promise;
           }else{
               return ChallengeList.getCategoryList();
           }
       },
       getSubCat:function(){
           if (ChallengeList.getSubCatList() == null){
               var promise = $http.post(adminRoot+'api/get_sub_category').then(function(response){
                   console.log("Sub CatLIST : "+JSON.stringify(response));
                   ChallengeList.setSubCatList(response.data.response);
                   return ChallengeList.getSubCatList();
               });
               return promise;
           }
           return ChallengeList.getSubCatList();

       },
       getSubCatForChallenge:function(){
           if (ChallengeList.getSubCatForChallenge() == null){
               var promise = $http.post(adminRoot+'api/get_sub_category_for_challenge').then(function(response){
                   ChallengeList.setSubCatForChallenge(response.data.response);
                   return ChallengeList.getSubCatForChallenge();
               })
               return promise;
           }
           return ChallengeList.getSubCatForChallenge();
       }

   }
});

myApp.factory('User',function(){
    var tagFilterList = [];
    var subCatFilterList = [];
    var tagCounter = 0;
    var subCounter = 0;
    var removeTagKey = function(key){
        tagFilterList.splice(key,1);

    }
    var removeSubKey = function(key){
        subCatFilterList.splice(key,1);

    }
    return {
        getTagFilters:function(){
            return tagFilterList;
        },
        getSubCatFilters:function(){
          return subCatFilterList;
        },
        setTagFilters:function(tag){
            var existing = 0;
            angular.forEach(tagFilterList,function(value,key){
                if (tag.tag_id === value.tag_id){
                    console.log("INITAL FILTER TAG LIST : "+ JSON.stringify(tagFilterList));
                    removeTagKey(key);
                    console.log("REMOVED KEY : "+key + "NEW FILTERED TAG LIST : "+JSON.stringify(tagFilterList));
                    //User.setTagFilters(tempFilterd);

                    existing = 1;
                    tagCounter--;
                    return;
                }
            });
            if (existing == 0){
                console.log("PUSHING TO TAG FILTER : "+JSON.stringify(tag));
                if (tagCounter < 3){
                    tagFilterList.push(tag);
                    tagCounter++;
                }

            }


        },
        setSubCatFilters:function(tag){
            var existing = 0;
            angular.forEach(subCatFilterList,function(value,key){
                if (tag.sub_id === value.sub_id){
                    console.log("INITAL FILTER Sub LIST : "+ JSON.stringify(subCatFilterList));
                    removeSubKey(key);
                    console.log("REMOVED KEY : "+key + "NEW FILTERED Sub LIST : "+JSON.stringify(subCatFilterList));
                    //User.setTagFilters(tempFilterd);

                    existing = 1;
                    subCounter--;
                    return;
                }
            });
            if (existing == 0){
                if (subCounter <3){
                    console.log("PUSHING TO TAG FILTER : "+JSON.stringify(tag));
                    subCatFilterList.push(tag);
                    subCounter++;
                }

            }


        },
        removeKey:function(key){

            tagFilterList.splice(key,1);
            return tagFilterList;
        }
    };
});
myApp.factory('ChallengeList',function(){
    var list = null;
    var challengeList = null;
    var contestList = null;
    var festivalList = null;
    var tagList = null;
    var tagForChallenge = null;
    var category_list = null;
    var sub_category_list = null;
    var sub_category_list_challenge = null;
    var current_list = null;
    var currentListFunction = {

        setCurrent:function(newList){
            current_list = newList;
        }
    };
    return {
        getCurrentList:function(){
            return current_list;
        },
        setCurrentList:function(newList){
            currentListFunction.setCurrent(newList);
        },
        getList:function(){
            currentListFunction.setCurrent(list);
            return list;
        },
        setList:function(newList){
            challengeList = null;
            contestList = null;
            festivalList = null;

            list = newList;
        },
        getTagForChallenge:function(){
            return tagForChallenge;
        },
        setTagForChallenge:function(tags){
          if (tagForChallenge == null){
              tagForChallenge = tags;
          }
            return tagForChallenge;
        },
        getSubCatForChallenge:function(){
            return sub_category_list_challenge;
        },
        setSubCatForChallenge:function(tags){
            if (sub_category_list_challenge == null){
                sub_category_list_challenge = tags;
            }
            return sub_category_list_challenge;
        },
        getTagList:function(){
            return tagList;
        },
        setTagList:function(newTagList){
            if (tagList == null){
                tagList = newTagList;
            }
            return tagList;
        },
        getSubCatList:function(){
            return sub_category_list;
        },
        setSubCatList:function(newTagList){
            if (sub_category_list == null){
                sub_category_list = newTagList;
            }
            return tagList;
        },
        getCategoryList:function(){
            return category_list;
        },
        setCategoryList:function(newCatList){
            if (category_list == null){
                category_list = newCatList;
            }
            return category_list;
        },
        getChallengeList:function(){
            if (challengeList == null){
                if (list != null){
                    challengeList = [];
                    angular.forEach(list,function(value,key){
                        if (value.cateogory_type == "challenge"){
                            this.push(value);
                        }

                    },challengeList);
                }
            }
            currentListFunction.setCurrent(challengeList);
            return challengeList;
        },
        getContestList:function(){
            if (contestList == null){
                if (list != null){
                    contestList = [];
                    angular.forEach(list,function(value,key){
                        if (value.cateogory_type == "challenge"){
                            this.push(value);
                        }

                    },contestList);
                }
            }
            currentListFunction.setCurrent(contestList);
            return contestList;
        },
        getFestivalList:function(){
            if (festivalList == null){
                if (list != null){
                    festivalList = [];
                    angular.forEach(list,function(value,key){
                        if (value.cateogory_type == "challenge"){
                            this.push(value);
                        }

                    },festivalList);
                }
            }
            currentListFunction.setCurrent(list);
            return festivalList;
        }

    };
});
directiveApp.directive('getDistance',function(definedVariable){
    var R = 6371;
    var user_info = JSON.parse(definedVariable.getStorage('hungryAuth'));
    var user_longitude = user_info.longitude;
    var user_latitude = user_info.latitude;
    var deg2rad = function(value){
        return value * Math.PI/180;
    }

    return {
        restrict: 'AE',
        template: '{{distance}}',
        scope: {
            longitude: '=',
            latitude: '='
        },
        link: function(scope, element, attr) {
            console.log("user_long: "+user_longitude+" user_lat: "+user_latitude+"long : "+scope.longitude+"lat : "+scope.latitude);
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(user_latitude-scope.latitude);  // deg2rad below
            var dLon = deg2rad(user_longitude-scope.longitude);
            var a =
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(deg2rad(user_latitude)) * Math.cos(deg2rad(scope.latitude)) *
                            Math.sin(dLon/2) * Math.sin(dLon/2)
                ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c; // Distance in km
            console.log("DISTANCE : "+d);
            scope.distance = d.toFixed(1);
        }
    };

});

myApp.factory('countryList',function($http,definedVariable){
    var adminRoot = definedVariable.getAdminRoot();
   var list = null;
    return{
        getList:function(){
            return list;
        },
        setList:function(){
            console.log('URL: '+adminRoot+'api/getCountryList');
            if (list == null){
                console.log("I am here");
                var req = $http.get(adminRoot+'api/getCountryList');
                /*req.success(function(data) {
                    list = data;
                    console.log("After success: "+JSON.stringify(list));
                });
                console.log("LIST:"+JSON.stringify(list));*/
                list = req.then(function(result){
                   return result.data;
                });
            }
            console.log(list);
            return list;
        }
    }
});
myApp.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            console.log(attrs.pwCheck);
            if (document.getElementById(attrs.pwCheck) != null){
                var valid = document.getElementById(attrs.pwCheck)===elem.val();
                console.log("VALID "+valid);
                ctrl.$setValidity('pwMatch',valid);
            }

        }
    }
}]);
myApp.filter('unique', function() {
    return function(collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});
myApp.filter('multipleSearch',['User','ChallengeList',function(User,ChallengeList){
    return function(challengeList,subCatForChallenge,tagForChallenge){

        var tagList = User.getTagFilters();
        var subList = User.getSubCatFilters();
        console.log("TAG LIST INSIDER FILTER : "+JSON.stringify(tagList));

        var result = [];
        var chall_id = [];
        var keys = [];
        var tempTags = [];
        var tempSub = [];
        console.log("TAG FOR CHALLENGE LIST : "+JSON.stringify(tagForChallenge));
        if (tagForChallenge.length == 0 && subCatForChallenge.length == 0){
            return challengeList;
        }
        angular.forEach(challengeList,function(value,key){
            tempTags = [];
            angular.forEach(tagForChallenge,function(val,k){
                if (value.id == val.challenge_id){
                    tempTags.push(val);
                }
            });
            tempSub = [];
            angular.forEach(subCatForChallenge,function(sVal,sKey){
               if (value.id == sVal.challenge_id){
                   tempSub.push(sVal);
               }
            });
            this.push({c_id:value.id,tag:tempTags,sub:tempSub});
        },keys);



        if (subList.length > 0){
            angular.forEach(subList,function(value,key){
                angular.forEach(keys,function(val,k){
                    angular.forEach(val.sub,function(a,b){
                        if (a.sub_category_detail_id == value.sub_id && chall_id.indexOf(a.challenge_id) == -1){
                            result.push(challengeList[k]);
                            chall_id.push(a.challenge_id);
                        }
                    });
                });
            });
            console.log("NEW RESULT : " + JSON.stringify(result));


        }
        if (tagList.length > 0){
            angular.forEach(tagList,function(value,key){
                    angular.forEach(keys,function(val,k){
                        angular.forEach(val.tag,function(a,b){
                            if (a.tag_detail_id == value.tag_id && chall_id.indexOf(a.challenge_id) == -1){
                                result.push(challengeList[k]);
                                chall_id.push(a.challenge_id);
                            }
                        });
                    });
            });
            console.log("NEW RESULT : " + JSON.stringify(result));


        }


        if (tagList.length > 0 || subList.length > 0){
            ChallengeList.setCurrentList(result);
            return result;
        }
        ChallengeList.setCurrentList(challengeList);
        return challengeList;
    };
}]);