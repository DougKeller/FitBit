angular.module('fitbit.controllers').controller('HeartrateController', ['$scope', '$http',
  function($scope, $http) {
    $scope.setActivity = function(activity) {
      $scope.mainActivity = activity
    }

    $scope.getActivities = function(weeks) {
      $http.get(Routes.heartrateSeries).then(function(response) {
        $scope.activities = response.data['activities-heart'].map(
          function(activity) {
            var zones = activity.value.heartRateZones
            var caloriesBurned = 0, totalMinutes = 0

            zones.forEach(function(zone) {
              zone.minutes = zone.minutes || 0
              zone.caloriesOut = zone.caloriesOut || 0
              totalMinutes += zone.minutes
              caloriesBurned += zone.caloriesOut
            })

            return {
              date: activity.dateTime,
              zones: zones,
              calories: caloriesBurned,
              minutes: totalMinutes
            }
          }
        )
      })
    }

    $scope.getActivities(1)
  }
])
