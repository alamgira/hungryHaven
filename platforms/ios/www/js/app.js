// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var myApp = angular.module('starter', ['ionic', 'starter.controllers','ui.router']);

myApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'homeCtrl'
        }
      }
    })
      .state('app.challengeList', {
          url: "/challengelist",
          views: {
              'menuContent' :{
                  templateUrl: "templates/challengContestList.html",
                  controller: 'challengeListCtrl'
              }
          }
      })
      .state('app.festival', {
          url: "/festivalList",
          views: {
              'menuContent' :{
                  templateUrl: "templates/festivalList.html",
                  controller: 'festivalListCtrl'
              }
          }
      })
      .state('app.influencers', {
          url: "/influencersList",
          views: {
              'menuContent' :{
                  templateUrl: "templates/influencerList.html",
                  controller: 'influencerListCtrl'
              }
          }
      })
      .state('app.details', {
          url: "/details/:id/:type",
          views: {
              'menuContent' :{
                  templateUrl: "templates/details.html",
                  controller: 'detailsCtrl'
              }
          }
      })
      .state('app.playlists', {
          url: "/playlists",
          views: {
              'menuContent' :{
                  templateUrl: "templates/playlists.html",
                  controller: 'PlaylistsCtrl'
              }
          }
      })
    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    })
      .state('checkLocation',{
          url:"/checkLocation",
          templateUrl:'templates/checkLocation.html',
          controller:'checkLocationCtrl'
      })
      .state('login',{
          url:"/login",

          templateUrl:'templates/login.html',
          controller:'LoginCtrl'
      })
      .state('login-registerUser',{

          url:"/login/registerUser",

          templateUrl:'templates/registerUser.html',
          controller:'registerCtrl'

      })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/checkLocation');
        //$provide("adminRoot","http://www.adminhungryhaven.com/")
}]);

