'use strict';

angular.module('fitbit.controllers', [])
angular.module('fitbit.factories', [])
angular.module('fitbit.services', [])

angular.module('fitbit', [
  'fitbit.controllers',
  'fitbit.factories',
  'fitbit.services',
  'ui.router'
])

angular.module('fitbit').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'States',
  function($stateProvider, $urlRouterProvider, $httpProvider, States) {
    $urlRouterProvider.otherwise('/')

    $httpProvider.interceptors.push('authorizationInterceptor')

    function loadStates(states, parent) {
      angular.forEach(states, function(state, key) {
        state.parent = parent

        if(state.parent)
          state.name = parent + '.' + key
        else
          state.name = key

        state.templateUrl = 'templates/' + state.templateUrl

        $stateProvider.state(state.name, state)

        if(state.children)
          loadStates(state.children, state.name)
      })
    }

    loadStates(States)
  }
]);

angular.module('fitbit').run(['$rootScope', '$state', 'AuthorizationService',
  function($rootScope, $state, AuthorizationService) {
    $rootScope.$on('unauthorized', function() {
      if($state.current.name !== 'unauthorized')
        $state.go('unauthorized')
    })

    $rootScope.$on('authorized', function() {
      if($state.current.name === 'unauthorized')
        $state.go('menu')
    })

    $rootScope.$on('$stateChangeStart', function(_evt, toState) {
      window.scrollTo(0, 0)
      if(toState.name !== 'unauthorized' && !AuthorizationService.authorized)
        $state.go('unauthorized')
    })
  }
])

var Routes = {
  authorize: 'authorize',
  heartrateSeries: 'heartrate/series'
}

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

angular.module('fitbit.controllers').controller('HeartrateController', ['$scope', '$http',
  function($scope, $http) {
    $scope.setActivity = function(activity) {
      $scope.mainActivity = activity
    }

    $scope.getActivities = function(weeks) {
      $http.get(Routes.heartrateSeries).then(function(response) {
        $scope.activities = response.data['activities-heart'].map(
          function(activity) {
            var zones = activity.value.heartRateZones
            var caloriesBurned = 0, totalMinutes = 0

            zones.forEach(function(zone) {
              zone.minutes = zone.minutes || 0
              zone.caloriesOut = zone.caloriesOut || 0
              totalMinutes += zone.minutes
              caloriesBurned += zone.caloriesOut
            })

            return {
              date: activity.dateTime,
              zones: zones,
              calories: caloriesBurned,
              minutes: totalMinutes
            }
          }
        )
      })
    }

    $scope.getActivities(1)
  }
])

angular.module('fitbit.controllers').controller('MenuController', ['$scope', '$state',
  function($scope, $state) {
  }
])

angular.module('fitbit.controllers').controller('UnauthorizedController', ['$scope', 'AuthorizationService',
  function($scope, AuthorizationService) {
  	$scope.authorizationService = AuthorizationService
  }
])
angular.module('fitbit.factories').factory('authorizationInterceptor', ['$rootScope', '$q', function($rootScope, $q) {
	return {
		responseError: function(response) {
			if(response.status === 401) {
				$rootScope.$broadcast('unauthorized')
			}

			return $q.reject(response)
		}
	}
}])
angular.module('fitbit.services').service('AuthorizationService', ['$http', '$rootScope',
  function($http, $rootScope) {
    var $ = this

    function setAuthorized() {
      $.authorized = true
      $rootScope.$broadcast('authorized')
    }

    function setNotAuthorized() {
      $.authorized = false
      $rootScope.$broadcast('unauthorized')
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
