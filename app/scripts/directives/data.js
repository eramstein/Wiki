'use strict';

app.directive('data', function($rootScope) {
  return {
    restrict: 'E',
    scope: {'s': '@',
            'p': '@',
            't': '@'},
    link: function(scope, elm, attrs) {
        //on click, show form by broadcasting an event listened by the article-edit controller
        elm.bind('click', function() {
            scope.$apply(function(){
                $rootScope.$broadcast('showDataForm',elm,scope.s,scope.p,scope.t);
            });
        });
        //tooltip (done manually to avoid storing tooltip attributes in the database)
        elm.bind('mouseenter', function() {
            scope.$apply(function(){
                $rootScope.$broadcast('showDirTooltip',elm, scope.p + " for " + scope.s);
            });
        });
        elm.bind('mouseout', function() {
            scope.$apply(function(){
                $rootScope.$broadcast('hideDirTooltip');
            });
        });
    }
  };
});