angular.module('fitbit.controllers').controller('MainController', ['$scope', '$http', 'AuthorizationService',
  function($scope, $http, AuthorizationService) {
    $scope.authorizationService = AuthorizationService

    $scope.heartRate = function() {
    	$http.get(Routes.heartrateSeries).then(function(response) {
    		console.log('SUCCESS', response)
    	}, function(response) {
    		console.log('ERROR', response)
    	})
    }
  }
])
