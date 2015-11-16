'use strict';

angular.module('fitbit.controllers', [])
angular.module('fitbit.services', [])

angular.module('fitbit', [
  'fitbit.controllers',
  'fitbit.services',
  'ui.router'
])

angular.module('fitbit').config(['$stateProvider', '$urlRouterProvider', 'States',
  function($stateProvider, $urlRouterProvider, States) {
    $urlRouterProvider.otherwise('/')

    function loadStates(states, parent) {
      angular.forEach(states, function(state, key) {
        state.parent = parent

        if(state.parent) {
          state.name = parent + '.' + key
        } else {
          state.name = key
        }

        state.templateUrl = 'templates/' + state.templateUrl

        $stateProvider.state(state.name, state)

        if(state.children) {
          loadStates(state.children, state.name)
        }
      })
    }

    loadStates(States)
  }
]);

var Routes = {
  authorize: 'authorize',
  heartrateSeries: 'heartrate/series'
}

angular.module('fitbit').constant('States', (function() {
  var State =  function(params) {
    angular.extend(this, params)
  }

  return {
    main: new State({
      url: '/',
      controller: 'MainController',
      templateUrl: 'general.html'
    })
  }
})())

angular.module('fitbit.controllers').controller('MainController', ['$scope', '$http', 'AuthorizationService',
  function($scope, $http, AuthorizationService) {
    $scope.authorizationService = AuthorizationService

    $scope.heartRate = function() {
    	$http.get(Routes.heartrateSeries).then(function(response) {
    		console.log('SUCCESS', response)
    	}, function(response) {
    		console.log('ERROR', response)
    	})
    }
  }
])

angular.module('fitbit.services').service('AuthorizationService', ['$http',
  function($http) {
    var $ = this

    function setAuthorized() {
      $.authorized = true
    }

    function setNotAuthorized() {
      $.authorized = false
    }

    function redirect(response) {
      if(response.status === 302) {
        $.authorized = false
        window.location.href = response.data
      }
    }

    function authorizationPath() {
      return Routes.authorize + '?url=' + encodeURIComponent(window.location.href.split('#')[0])
    }

    this.authorize = function() {
      $http.get(authorizationPath()).then(setAuthorized, redirect)
    }

    this.checkAuthorized = function() {
      $http.get(authorizationPath()).then(setAuthorized, setNotAuthorized)
    }

    this.checkAuthorized()
  }
])
