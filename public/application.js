'use strict';

angular.module('fitbit.controllers', [])
angular.module('fitbit.directives', [])
angular.module('fitbit.factories', [])
angular.module('fitbit.services', [])
angular.module('fitbit.filters', [])

angular.module('fitbit', [
  'fitbit.controllers',
  'fitbit.directives',
  'fitbit.factories',
  'fitbit.services',
  'fitbit.filters',
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

angular.module('fitbit.controllers').controller('HeartrateController', ['$scope', '$http', '$filter', 
  function($scope, $http, $filter) {
    $scope.data = []
    $scope.labels = []

    $http.get(Routes.heartrateIntraday).then(function(response) {
      $scope.data = []
      $scope.labels = []
      var data = response.data['activities-heart-intraday'].dataset

      $scope.data = $filter('parseData')(data)

      console.log($scope.data)
    })

    $scope.saveLog = function() {
      var body = '"Time","BPM"\n'

      var data = $scope.data
      for(var i = 0; i < data.length; i++) {
        body += '"' + data.labels[i] + '","' + data.values[i] + '"\n'
      }

      var csvContent = "data:text/csv;charset=utf-8," + body

      var encodedUri = encodeURI(csvContent)
      var link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'log.csv')

      link.click()
    }
  }
])

angular.module('fitbit.controllers').controller('MenuController', ['$scope', '$state', function($scope, $state) { }])

angular.module('fitbit.controllers').controller('UnauthorizedController', ['$scope', 'AuthorizationService',
  function($scope, AuthorizationService) {
  	$scope.authorizationService = AuthorizationService
  }
])
angular.module('fitbit.directives').directive('chart', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      ngModel: '='
    },
    link: function(scope, element, attrs) {
      var loaded = false
      $timeout(function() { loaded = true })
      scope.canvasId = (attrs.id || 'chart') + 'Canvas'

      function data() {
        var labels = scope.ngModel.chartLabels
        var values = scope.ngModel.values

        return {
          labels: labels,
          datasets: [
            {
              fillColor: "rgba(220,120,120,0.2)",
              strokeColor: "rgba(220,120,120,1)",
              data: values
            }
          ]
        }
      }

      function options() {
        return {
          pointDotRadius: 0,
          showTooltips: false,
          scaleShowVerticalLines: false
        }
      }

      function drawData() {
        var ctx = document.getElementById(scope.canvasId).getContext('2d')
        var ch = new Chart(ctx).Line(data(), options())
      }

      scope.$watchCollection(function(){
        return scope.ngModel
      }, function() {
        if(loaded) {
          drawData()
        }
      })
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
angular.module('fitbit.filters').filter('parseData', [function() {
	return function(data) {
		var parsed = []
		var nextPos = 0

		function formatTime(hour, minute) {
			var e = hour < 12 ? 'am' : 'pm'
			var mod = hour % 12
			hour = hour || 12
			hour = (mod > 0) ? mod : hour

			if(minute < 10) {
				minute = '0' + minute
			}

			return '' + hour + ':' + minute + e
		}

		function addEntry(value) {
			var hour = Math.floor(nextPos / 60)
			var minute = nextPos - hour * 60
			var label = formatTime(hour, minute)
			var chartLabel = minute === 0 ? label : ''

			parsed.push({ chartLabel: chartLabel, label: label, value: value })
			nextPos += 1
		}

		data.forEach(function(entry) {
			var split = entry.time.split(':')
			var pos = parseInt(split[0]) * 60 + parseInt(split[1])

			while(nextPos !== pos) {
				addEntry(0)
			}

			addEntry(entry.value)
		})

		while(nextPos < 1440) {
			addEntry(0)
		}

		var chartLabels = parsed.map(function(v) {
			return v.chartLabel
		})
		var labels = parsed.map(function(v) {
			return v.label
		})
		var values = parsed.map(function(v) {
			return v.value
		})

		return { chartLabels: chartLabels, labels: labels, values: values, length: labels.length }
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
