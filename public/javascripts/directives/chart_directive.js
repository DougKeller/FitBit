angular.module('fitbit.directives').directive('chart', [function() {
  return {
    restrict: 'E',
    scope: {
      ngModel: '=',
      labels: '='
    },
    link: function(scope, element, attrs) {
      scope.canvasId = (attrs.id || 'chart') + 'Canvas'

      function data() {
        return {
          labels: scope.labels || ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          datasets: [
            {
              fillColor: "rgba(220,120,120,0.2)",
              strokeColor: "rgba(220,120,120,1)",
              pointColor: "rgba(220,120,120,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,120,120,1)",
              data: [70, 80, 120, 95, 80, 60, 70]
            }
          ]
        }
      }

      function options() {
        return {
          scaleOverride: true,
          scaleSteps: 10,
          scaleStepWidth: 10,
          scaleStartValue: 50
        }
      }

      function drawData() {
        var ctx = document.getElementById(scope.canvasId).getContext('2d')
        var ch = new Chart(ctx).Line(data(), options())
      }

      scope.$watchCollection(function(){ return scope.ngModel }, drawData)
    },
    template: '<canvas id="{{ canvasId }}"></canvas>'
  }
}])
