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
