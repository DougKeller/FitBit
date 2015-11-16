angular.module('fitbit.controllers').controller('MainController', ['$scope', '$http',
  function($scope, $http) {
    $scope.heartRate = function() {
      $http.get(Routes.heartrateSeries).then(function(response) {})
    }
  }
])
