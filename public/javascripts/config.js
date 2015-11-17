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
