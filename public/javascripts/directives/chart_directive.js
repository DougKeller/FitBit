angular.module('fitbit.directives').directive('chart', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      ngModel: '='
    },
    link: function(scope, element, attrs) {
      var loaded = false
      $timeout(function() { loaded = true })
      scope.canvasId = (attrs.id || 'chart') + 'Canvas'

      function data() {
        var labels = scope.ngModel.chartLabels
        var values = scope.ngModel.values

        return {
          labels: labels,
          datasets: [
            {
              fillColor: "rgba(220,120,120,0.2)",
              strokeColor: "rgba(220,120,120,1)",
              data: values
            }
          ]
        }
      }

      function options() {
        return {
          pointDotRadius: 0,
          showTooltips: false,
          scaleShowVerticalLines: false
        }
      }

      function drawData() {
        var ctx = document.getElementById(scope.canvasId).getContext('2d')
        var ch = new Chart(ctx).Line(data(), options())
      }

      scope.$watchCollection(function(){
        return scope.ngModel
      }, function() {
        if(loaded) {
          drawData()
        }
      })
    },
    template: '<canvas id="{{ canvasId }}"></canvas>'
  }
}])
