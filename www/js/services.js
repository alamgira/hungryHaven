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
    var pic_id = null;
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
        pic_id = JSON.parse(r.response).pic_id;

        console.log("Sent = " + r.bytesSent);

    };
    var fail = function(error){
        console.log("Error: "+JSON.stringify(error));
    };
    return {
        getPicId:function(){
            return pic_id;
        },
        load: function() {
            return $http.get('/api/v1/auth');
        },
        logout: function() {

            //return $http.get('/auth/logout');
            ///var logout = $http.get(adminRoot + 'auth/logout');
            uncacheSession();
            deleteSession();

           /* blogList.clearMemory();
            /*influencerList.clearMemory();
            ChallengeList.clearMemory();
            countryList.clearMemory();*/
            //logout.success(uncacheSession, deleteSession);
            return true;
        },
        checkLogin:function(inputs){
            console.log("check login inputs: "+JSON.stringify(inputs));
            var promise = $http.post(adminRoot+'api/appLogin',inputs).then(function(response){

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
            var promise = $http.post(adminRoot + 'api/forget_your_password', inputs).then(function (response) {
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
            options.mimeType="text/plain";

            var params = new Object();

            options.params = params;
            var url = adminRoot+'api/profileImageUpload';
            var ft = new FileTransfer();
            ft.upload(imageURI, encodeURI(url), win, fail, options);
        },
        locations: function() {
            return $http.get('/api/v1/auth/locations');
        },
        isLoggedIn: function() {
            //return $http.get('/auth/check');
            return JSON.parse(StorageService.get('hungryAuth'));
        },
        update_user:function(inputs){

            var promise = $http.post(adminRoot+'api/update_user_info',inputs).then(function(response){
                console.log("RESPONSE : "+ JSON.stringify(response));
                if (response.data.status == "success"){
                    return true;
                }
                return false;
            });
            return promise;
        },
        fb_login:function(inputs){
            console.log("FB INPUT: "+ JSON.stringify(inputs));
            var promise = $http.post(adminRoot + 'api/fb_signin',inputs).then(function(response){
                console.log("FB API RESPONSE "+JSON.stringify(response));
                return response.data;
            });
            return promise;
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
myApp.factory("adMobHelper",function(){
    var ad_units = {
        ios : {
            banner: '/61407247/300x250_HungryHaven_AndroidAppROA' // or DFP format "/6253334/dfp_example_ad"

        },
        android : {
            banner: '/61407247/300x250_HungryHaven_AndroidAppROA' // or DFP format "/6253334/dfp_example_ad"

        }
    };
    return{
        getAndroid:function(){
            return ad_units.android;
        },
        getIos:function(){
            return ad_units.ios;
        }
    }
});
myApp.factory('addMarker', function() {
    var currentMarkerList = [];
    var removeAllMarkers = function(){

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
                var festival_icon = "www/img/pin-festivals.png";

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
                        icon = festival_icon;
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
                        'zoom': 10,
                        'duration': 5000 // = 5 sec.
                    }, function() {
                        console.log("The animation is done");
                    });
                }


                return true;
            }


            return false;

        }
    }
});

myApp.factory('dataService',function($http,definedVariable,ChallengeList,influencerList,blogList){
    var adminRoot = definedVariable.getAdminRoot();
    var auth_token = definedVariable.getStorage('hungryAuth');
    var utils = {

    };

   return{
        get_auth_token:function(){
          return auth_token;
        },
        send_feedback:function(inputs){
            var promise = $http.post(adminRoot + 'api/send_feedback',inputs).then(function(response){
               return response.data;
            });
            return promise;
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
               });
               return promise;
           }
           return ChallengeList.getSubCatForChallenge();
       },
       getInfluencers:function(){
           if (influencerList.getInfluencerList() == null){
               var promise = $http.post(adminRoot + 'api/get_influencers').then(function(response){
                    influencerList.setInfluencerList(response.data.response);
                   return influencerList.getInfluencerList();
               });
               return promise;
           }
           return influencerList.getInfluencerList();
       },
       getInfluencersVideoById:function(id){
           var promise = $http.post(adminRoot + 'api/get_influencer_video',{id:id}).then(function(response){
               console.log("DATA SERVICE VIDEO RESPONSE "+JSON.stringify(response));
                return response.data.response;
           });
           return promise;
       },
       getBlog:function(){
            if (blogList.getBlogList() == null){
                var promise = $http.post(adminRoot + 'api/get_blog').then(function(response){
                    blogList.setBlogList(response.data.response);
                    return blogList.getBlogList();
                });
                return promise;
            }
           return blogList.getBlogList();
       },
       getUserInfo:function(inputs){
           var promise = $http.post(adminRoot + 'api/get_user_info',inputs).then(function(response){
               console.log("CALLED RESPONSE "+JSON.stringify(response));
               return response.data.response;
           });
           return promise;
       }

   }
});
myApp.factory('blogList',function(){
    var blogList = null;
    return{
        clearMemory:function(){
            blogList = null;
            return true;
        },
        getBlogList:function(){
            return blogList;
        },
        setBlogList:function(blog){
            blogList = blog;
        }
    }
});
myApp.factory('influencerList',function(){
    var list = null;
    return {
        clearMemory:function(){
            list = null;
            return true;
        },
        getInfluencerList:function(){
            return list;
        },
        setInfluencerList:function(newList){
            list = newList;
        }
    };
});
myApp.factory('User',function($rootScope,Auth,dataService){
    var tagFilterList = [];
    var subCatFilterList = [];
    var userInfo = null;
    var tagCounter = 0;
    var subCounter = 0;
    var removeTagKey = function(key){
        tagFilterList.splice(key,1);

    }
    var removeSubKey = function(key){
        subCatFilterList.splice(key,1);

    }
    return {
        emptyUser:function(){
            userInfo = null;
            return true;
        },
        getUserInfo:function(){
            if (userInfo == null){
                var loggedIn = Auth.isLoggedIn();
                var inputs = {auth_token:loggedIn.auth_token};
                console.log("Input User "+JSON.stringify(inputs));
                var promise = dataService.getUserInfo(inputs).then(function(response){
                    userInfo = response;
                    return response;
                });
                console.log("USERINFO IS "+ JSON.stringify(promise));
                return promise;
            }
            return userInfo;

        },
        refreshUserInfo:function(){
            var loggedIn = Auth.isLoggedIn();
            var inputs = {auth_token:loggedIn.auth_token};
            console.log("Input User "+JSON.stringify(inputs));
            var promise = dataService.getUserInfo(inputs).then(function(response){
                userInfo = response;
                console.log("REFRESHING "+JSON.stringify(response));

                $rootScope.$broadcast('user:updated',userInfo);
                return response;
            });

            return promise;
        },
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
        clearMemory:function(){
            list = null;
            challengeList = null;
            contestList = null;
            festivalList = null;
            tagList = null;
            tagForChallenge = null;
            category_list = null;
            sub_category_list = null;
            sub_category_list_challenge = null;
            current_list = null;
            return true;
        },
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
                        if (value.category_name == "challenge"){
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
                        if (value.category_name == "contest"){
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
                        if (value.category_name == "festival"){
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
    var user_longitude, user_latitude;
    var user_info = JSON.parse(definedVariable.getStorage('hungryAuth'));
    if (typeof sessionStorage.getItem('current_user_longitude') !== 'undefined' && typeof sessionStorage.getItem('current_user_latitude') !== 'undefined'){
        user_longitude = sessionStorage.getItem('current_user_longitude');
        user_latitude = sessionStorage.getItem('current_user_latitude');
    }else{
         user_longitude = user_info.longitude;
         user_latitude = user_info.latitude;
    }

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
            if (d >999){
                scope.distance = "999+";
            }else{
                scope.distance = d.toFixed(1);
            }

        }
    };

});

myApp.factory('countryList',function($http,definedVariable){
    var adminRoot = definedVariable.getAdminRoot();
   var list = null;
    return{
        clearMemory:function(){
          list = null;
        },
        getList:function(){
            return list;
        },
        setList:function(){
            console.log('URL: '+adminRoot+'api/getCountryList');
            if (list == null){

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
        if ((tagForChallenge.length == "undefined" && subCatForChallenge.length == "undefined") || (tagForChallenge.length == 0 && subCatForChallenge.length == 0)){
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

myApp.filter('groupTime',[function(){
    var groups = [];
    var keys = [];
    var monthName = ["January","February","March","April","May","June","July","August","September","October","Novemeber","December"];
    var parseTimestamp = function(time){
        var t = time.split(/[- :]/);

        var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
        var fullYear = d.getFullYear();
        var month = d.getMonth();
        return monthName[month] + " "+fullYear;
    }
    return function(challengeList,keyname){
        angular.forEach(challengeList,function(value,key){
            console.log("KEY "+key);
            var currKey = parseTimestamp(value.timestamp);
            if (keys.indexOf(currKey) == -1){
                value.currentKey = key;
                var g = {
                    currKey:currKey,
                    listing: [value]
                }
                groups.push(g);
                keys.push(currKey);
            }
            else{
                var keyIndex = keys.indexOf(currKey);
                if (groups[keyIndex].listing.indexOf(value) == -1){
                    value.currentKey = key;
                    groups[keyIndex].listing.push(value);
                }
            }

        });

        return groups;
    };
}]);
myApp.filter('groupBy',[function(){
    var groups = [];
    var keys = [];

    return function(challengeList){
        angular.forEach(challengeList,function(value,key){

            var currKey = value.blog_type_name;
            if (keys.indexOf(currKey) == -1){
                if (value.status == "active"){
                    value.currentKey = key;
                    var g = {
                        currKey:currKey,
                        listing: [value]
                    }
                    groups.push(g);
                    keys.push(currKey);
                }

            }
            else{
                var keyIndex = keys.indexOf(currKey);
                if (groups[keyIndex].listing.indexOf(value) == -1 && value.status=="active"){
                    value.currentKey = key;
                    groups[keyIndex].listing.push(value);
                }
            }

        });
        console.log("GROUP IS : "+JSON.stringify(groups));
        return groups;
    };
}]);
myApp.filter('cut',[function(){
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
}]);
directiveApp.directive('shortDate',function(){

    var monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    return {
        restrict: 'AE',
        template: '<h2 >{{mon}}</h2><h4>{{date}}</h4>',
        scope: {
            timeset: '='
        },
        link: function(scope, element, attr) {
            var t = scope.timeset.split(/[- :]/);
            if (parseInt(t[0]) != 0 && parseInt(t[1])!=0 && parseInt(t[2])!=0){
                var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                scope.mon = monthName[d.getMonth()];
                scope.date = d.getDate();
            }
            else{
                scope.mon = '';
                scope.date='';
            }

        }
    };

});

directiveApp.directive('cleanDate',function(){

    var monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    return {
        restrict: 'AE',
        template: '{{mon}} {{date}}',
        scope: {
            timeset: '='
        },
        link: function(scope, element, attr) {
            var t = scope.timeset.split(/[- :]/);
            console.log(t);
            if (parseInt(t[0]) != 0 && parseInt(t[1])!=0 && parseInt(t[2])!=0){
                var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                scope.mon = monthName[d.getMonth()];
                scope.date = d.getDate();
            }
            else{
                scope.mon = '';
                scope.date='';
            }

        }
    };

});
directiveApp.directive('youImage',function(){
    return{
        restrict: 'AE',
        template: '<img src="{{youLink}}" />',
        scope:{
            urlset: '='
        },
        link: function(scope,element, attr){

            if (scope.urlset.indexOf('youtu.be') > -1){
                var pieces = scope.urlset.split(/[\s/]+/);
                scope.youLink = 'http://img.youtube.com/vi/'+pieces[pieces.length -1]+'/0.jpg';
            }else{
                scope.youLink = "";
            }

        }
    }
});

directiveApp.directive('disableScreen', function() {
        return {
            restrict: 'E',
            link: function(scope, element) {
                $ionicGesture.on('drag', function() {
                    console.log('registered drag!');
                    //hasClass('display') is a proxy for this directive being active
                    element.hasClass('display') && scope.$$childHead.toggleOpenMenu();
                }, element);
                scope.$watch(
                    function() {
                        return scope.sideMenuContentTranslateX;
                    }, function(translateVal) {
                        if(Math.abs(translateVal) === 275) {
                            !element.hasClass('display') && element.addClass('display');
                        } else {
                            element.hasClass('display') && element.removeClass('display');
                        }
                    });
            }
        };
    });