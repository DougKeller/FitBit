'use strict';

angular.module('fitbit.controllers', [])
angular.module('fitbit.directives', [])
angular.module('fitbit.factories', [])
angular.module('fitbit.services', [])

angular.module('fitbit', [
  'fitbit.controllers',
  'fitbit.directives',
  'fitbit.factories',
  'fitbit.services',
  'ui.router'
])
