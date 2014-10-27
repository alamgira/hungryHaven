'use strict';


myApp.factory('Auth', function($http, $location, SessionService, StorageService, adminRoot){
    var cacheSession = function(data) {
        SessionService.set('couponzies-login', JSON.stringify(data));
    };
    var uncacheSession = function() {
        SessionService.unset('couponzies-login');
    };
    var saveSession = function(data) {
        StorageService.set('couponzies-login', JSON.stringify(data));
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
            var login = $http.post(adminRoot + 'auth/login', inputs);
            login.success(function(data) {
                cacheSession(data);
                if(inputs.remember) {
                    console.log('remember this login');
                    saveSession(data);
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
            var promise = $http.post(adminRoot + 'auth/changepassword', inputs).then(function (response) {
                return response.data;
            });
            return promise;
        },
        register: function(inputs) {
            return $http.post('/api/v1/auth/register', inputs);
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
            localStorage.getItem(key);
        },
        set: function(key, val) {
            return localStorage.setItem(key, val);
        },
        unset: function(key) {
            return localStorage.removeItem(key);
        }
    }
});