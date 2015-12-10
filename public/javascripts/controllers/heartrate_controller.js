angular.module('fitbit.controllers').controller('HeartrateController', ['$scope', '$http', '$filter', 
  function($scope, $http, $filter) {
    $scope.data = []
    $scope.labels = []

    $http.get(Routes.heartrateIntraday).then(function(response) {
      $scope.data = []
      $scope.labels = []
      var data = response.data['activities-heart-intraday'].dataset

      $scope.data = $filter('parseData')(data)

      console.log($scope.data)
    })

    $scope.saveLog = function() {
      var body = '"Time","BPM"\n'

      var data = $scope.data
      for(var i = 0; i < data.length; i++) {
        body += '"' + data.labels[i] + '","' + data.values[i] + '"\n'
      }

      var csvContent = "data:text/csv;charset=utf-8," + body

      var encodedUri = encodeURI(csvContent)
      var link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'log.csv')

      link.click()
    }
  }
])
