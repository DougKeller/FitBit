angular.module('fitbit').constant('States', (function() {
  var State =  function(params) {
    angular.extend(this, params)
  }

  return {
    main: new State({
      url: '/',
      controller: 'HeartrateController',
      templateUrl: 'heartrate.html',
      onEnter: ['$state', 'AuthorizationService', function($state, AuthorizationService) {
        if(!AuthorizationService.authorized) {
          $state.go('unauthorized')
        }
      }]
    }),
    unauthorized: new State({
      url: '/unauthorized',
      controller: 'UnauthorizedController',
      templateUrl: 'unauthorized.html',
      onEnter: ['$state', 'AuthorizationService', function($state, AuthorizationService) {
        if(AuthorizationService.authorized) {
          $state.go('main')
        }
      }]
    })
  }
})())
