angular.module('fitbit.controllers').controller('HeartrateController', ['$scope', '$http',
  function($scope, $http) {
  $scope.data = []
  $scope.labels = []

  $http.get(Routes.heartrateIntraday).then(function(response) {
    $scope.data = []
    $scope.labels = []
    var data = response.data['activities-heart-intraday'].dataset

    data.forEach(function(node, index) {
      $scope.data.push(node.value)
      if(index === 0 || index === data.length - 1) {
        $scope.labels.push(node.time)
      } else {
        $scope.labels.push('')
      }
    })
  })
  }
])
