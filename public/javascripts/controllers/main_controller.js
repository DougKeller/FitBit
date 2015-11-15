angular.module('fitbit.controllers').controller('MainController', ['$scope', '$http',
  function($scope, $http) {

    $scope.authorize = function() {
      $http.get('api/authorize').then(function(response) {
        console.log(response.data)
      },  function(response) {
        console.log('ERROR')
        console.log(response.data)
      })
    }
  }
])
