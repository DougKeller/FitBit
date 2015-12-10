angular.module('fitbit.controllers').controller('HeartrateController', ['$scope', '$http', '$filter', 
  function($scope, $http, $filter) {
    $scope.data = $filter('parseData')([])

    $scope.date = new Date()

    $scope.loadData = function() {
      var dateStr = $filter('date')($scope.date, 'MM-dd-yyyy')
      $http.get(Routes.heartrateIntraday + '?date=' + dateStr).then(function(response) {
        var data = response.data['activities-heart-intraday'].dataset
        $scope.data = $filter('parseData')(data)
      })
    }

    $scope.saveLog = function() {
      var body = '"Time","BPM"\n'
      var name = 'fitbit' + $filter('date')($scope.date, '_MM_dd_yyyy') + '.csv'

      var data = $scope.data
      for(var i = 0; i < data.length; i++) {
        body += '"' + data.logLabels[i] + '","' + data.values[i] + '"\n'
      }

      var csvContent = "data:text/csv;charset=utf-8," + body

      var encodedUri = encodeURI(csvContent)
      var link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', name)

      link.click()
    }

    $scope.$watch(function() {
      return $scope.date
    }, $scope.loadData)
  }
])
