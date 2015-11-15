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
  authorize: 'authorize'
}

angular.module('fitbit').constant('States', (function() {
  var State =  function(params) {
    angular.extend(this, params)
  }

  return {
    main: new State({
      url: '/',
      controller: 'MainController',
      templateUrl: 'testing.html'
    })
  }
})())

angular.module('fitbit.controllers').controller('MainController', ['$scope', '$http', '$location',
  function($scope, $http, $location) {

    $scope.authorize = function() {
      var path = Routes.authorize + '?url=' + encodeURIComponent(window.location.href.split('#')[0])
      $http.get(path).then(function(response) {
        window.location.href = response.data
      })
    }
  }
])
