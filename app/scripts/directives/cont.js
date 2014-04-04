'use strict';

app.directive('cont', function($rootScope) {
  return {
    restrict: 'E',
    scope: {'content': '@'},
    link: function(scope, elm, attrs) {
        //TODO : onclick, open form to edit the container
    }
  };
});