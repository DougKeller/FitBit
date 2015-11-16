'use strict';

angular.module('fitbit.controllers', [])
angular.module('fitbit.factories', [])
angular.module('fitbit.services', [])

angular.module('fitbit', [
  'fitbit.controllers',
  'fitbit.factories',
  'fitbit.services',
  'ui.router'
])
