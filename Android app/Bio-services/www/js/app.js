// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('Bioservices', ['ionic', 'starter.controllers', 'nfcFilters'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.setup', {
    url: '/setup',
    views: {
      'menuContent': {
        templateUrl: 'templates/setup.html'
      }
    }
  })

  .state('app.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/account.html'
        }
      }
    })
    .state('app.services', {
      url: '/services',
      views: {
        'menuContent': {
          templateUrl: 'templates/services.html',
          controller: 'ServicesCtrl'
        }
      }
    })

    .state('app.entry', {
      url: '/entry',
      views: {
        'menuContent': {
          templateUrl: 'templates/entry.html',
          controller: 'EntryCtrl'
        }
      }
    })
  .state('app.service', {
    url: '/services/:serviceId',
    views: {
      'menuContent': {
        templateUrl: 'templates/service.html',
        controller: 'ServiceCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/entry');
});
