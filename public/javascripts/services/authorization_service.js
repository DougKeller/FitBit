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
