// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var myApp = angular.module('starter', ['ionic', 'starter.controllers','ui.router','starter.directives','starter.filters']);
var directiveApp = angular.module('starter.directives',[]);
var filterApp = angular.module('starter.filters',[]);

myApp.run(function($ionicPlatform,Auth,$location) {
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
      console.log("RUNNING");
    //var loggedIn = localStorage.getItem('hungryAuth');


          var loggedIn = Auth.isLoggedIn();
          console.log("LG "+JSON.stringify(loggedIn));


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
      .state('app.blog', {
          url: "/blog",
          views: {
              'menuContent' :{
                  templateUrl: "templates/blog.html",
                  controller: 'blogListCtrl'
              }
          }
      })
      .state('app.about', {
          url: "/about",
          views: {
              'menuContent' :{
                  templateUrl: "templates/about.html",
                  controller: 'aboutCtrl'
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
      .state('app.influencer_details', {
          url: "/influencer_details/:id",
          views: {
              'menuContent' :{
                  templateUrl: "templates/influencerDetails.html",
                  controller: 'detailsCtrl'
              }
          }
      })
      .state('app.settings', {
          url: "/settings",
          views: {
              'menuContent' :{
                  templateUrl: "templates/settings.html",
                  controller: 'settingsCtrl'
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
      .state('app.mapit',{
          url: "/details/mapit/:currentIndex/:type",
          views: {
              'menuContent' :{
                  templateUrl: "templates/mapIt.html",
                  controller: 'mapCtrl'
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

