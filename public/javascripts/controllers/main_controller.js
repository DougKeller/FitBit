angular.module('fitbit.controllers').controller('MainController', ['$scope', '$http', '$location',
  function($scope, $http, $location) {

    $scope.authorize = function() {
      $http.get(Routes.authorize).then(function(response) {
        window.location.href = response.data
      })
    }
  }
])
