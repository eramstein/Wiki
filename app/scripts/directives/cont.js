'use strict';

app.directive('cont', function($rootScope) {
  return {
    restrict: 'E',
    scope: {'content': '@'},
    link: function(scope, elm, attrs) {
        //on click, show form by broadcasting an event listened by the article-edit controller
        elm.bind('click', function() {
            scope.$apply(function(){
                $rootScope.$broadcast('showContForm',elm,scope.content);
            });
        });
    }
  };
});