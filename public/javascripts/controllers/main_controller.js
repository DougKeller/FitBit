angular.module('fitbit.controllers').controller('MainController', ['$scope', '$http', 'AuthorizationService',
  function($scope, $http, AuthorizationService) {
    $scope.authorizationService = AuthorizationService
  }
])
