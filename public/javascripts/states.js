angular.module('fitbit').constant('States', (function() {
  var State =  function(params) {
    angular.extend(this, params)
  }

  return {
    menu: new State({
      url: '/',
      controller: 'MenuController',
      templateUrl: 'menu.html',
      onEnter: ['$state', 'AuthorizationService', function($state, AuthorizationService) {
        if(!AuthorizationService.authorized) {
          $state.go('unauthorized')
        }
      }]
    }),
    heartrate: new State({
      url: '/heartrate',
      controller: 'HeartrateController',
      templateUrl: 'heartrate.html'
    }),
    unauthorized: new State({
      url: '/unauthorized',
      controller: 'UnauthorizedController',
      templateUrl: 'unauthorized.html',
      onEnter: ['$state', 'AuthorizationService', function($state, AuthorizationService) {
        if(AuthorizationService.authorized) {
          $state.go('authorized')
        }
      }]
    })
  }
})())
