angular.module('fitbit.controllers').controller('MainController', ['$scope', 'AuthorizationService',
  function($scope, AuthorizationService) {
    $scope.authorizationService = AuthorizationService
  }
])
