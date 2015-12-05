angular.module('fitbit.controllers').controller('HeartrateController', ['$scope', '$http',
  function($scope, $http) {
    $scope.data = []

    $http.get(Routes.heartrateIntraday).then(function(response) {
      $scope.data.push({})
    })
  }
])
