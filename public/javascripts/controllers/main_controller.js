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
