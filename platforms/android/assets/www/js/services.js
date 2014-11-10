'use strict';

myApp.factory('definedVariable',function(){
    return{
        getAdminRoot:function(){
            return "http://admin2.hungryhaven.com/index.php/";
        }
    }
})
myApp.factory('Auth', function($http, $location, SessionService, StorageService,definedVariable){
    var adminRoot = definedVariable.getAdminRoot();
    var cacheSession = function(data) {
        SessionService.set('couponzies-login', JSON.stringify(data));
    };
    var uncacheSession = function() {
        SessionService.unset('couponzies-login');
    };
    var saveSession = function(data) {
        StorageService.set('hungryAuth', JSON.stringify(data));
    };
    var deleteSession = function() {
        StorageService.unset('couponzies-login');
    };

    return {
        load: function() {
            return $http.get('/api/v1/auth');
        },
        logout: function() {
            //return $http.get('/auth/logout');
            var logout = $http.get(adminRoot + 'auth/logout');
            logout.success(uncacheSession, deleteSession);
            return logout;
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
        locations: function() {
            return $http.get('/api/v1/auth/locations');
        },
        isLoggedIn: function() {
            //return $http.get('/auth/check');
            return SessionService.get('couponzies-login');
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
    return {
        addMarkerList: function(map,list) {

            var title,longitude,latitude,latlng;
            var icon = "/img/blu-Map.png";
            angular.forEach(list,function(value,key){
                if (value.title != null){
                    title = value.title;
                }
                longitude = value.longitude;
                latitude = value.latitude;
                latlng = new plugin.google.maps.LatLng(latitude,longitude);

                map.addMarker(
                    {
                        'position':latlng,
                        'title':title,
                        'icon':icon

                    },function(marker){
                        console.log("marker added");
                    });

                //localStorage.getItem(key);


            });
            return true;
        }
    }
});

myApp.factory('dataService',function($http){
   return{
        getContent:function(){
            return;
        },
       loginUser:function(){
           return;
       }
   }
});

myApp.factory('User',function(){

    return {};
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