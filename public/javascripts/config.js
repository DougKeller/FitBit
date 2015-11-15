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
