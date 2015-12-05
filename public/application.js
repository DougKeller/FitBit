'use strict';

angular.module('fitbit.controllers', [])
angular.module('fitbit.directives', [])
angular.module('fitbit.factories', [])
angular.module('fitbit.services', [])

angular.module('fitbit', [
  'fitbit.controllers',
  'fitbit.directives',
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
        $state.go('main')
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
  heartrateSeries: 'heartrate/series',
  heartrateIntraday: 'heartrate/intraday'
}

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

angular.module('fitbit.controllers').controller('HeartrateController', ['$scope', '$http',
  function($scope, $http) {
    $scope.data = []

    $http.get(Routes.heartrateIntraday).then(function(response) {
      $scope.data.push({})
    })
  }
])

angular.module('fitbit.controllers').controller('MenuController', ['$scope', '$state', function($scope, $state) { }])

angular.module('fitbit.controllers').controller('UnauthorizedController', ['$scope', 'AuthorizationService',
  function($scope, AuthorizationService) {
  	$scope.authorizationService = AuthorizationService
  }
])
angular.module('fitbit.directives').directive('chart', [function() {
  return {
    restrict: 'E',
    scope: {
      ngModel: '=',
      labels: '='
    },
    link: function(scope, element, attrs) {
      scope.canvasId = (attrs.id || 'chart') + 'Canvas'

      function data() {
        return {
          labels: scope.labels || ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          datasets: [
            {
              fillColor: "rgba(220,120,120,0.2)",
              strokeColor: "rgba(220,120,120,1)",
              pointColor: "rgba(220,120,120,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,120,120,1)",
              data: [70, 80, 120, 95, 80, 60, 70]
            }
          ]
        }
      }

      function options() {
        return {
          scaleOverride: true,
          scaleSteps: 10,
          scaleStepWidth: 10,
          scaleStartValue: 50
        }
      }

      function drawData() {
        var ctx = document.getElementById(scope.canvasId).getContext('2d')
        var ch = new Chart(ctx).Line(data(), options())
      }

      scope.$watchCollection(function(){ return scope.ngModel }, drawData)
    },
    template: '<canvas id="{{ canvasId }}"></canvas>'
  }
}])

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
