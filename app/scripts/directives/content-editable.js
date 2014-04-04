'use strict';

app.directive('contenteditable', function($rootScope, $compile, TerribleStuff) {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      // view -> model
      element.bind('blur', function() {
        //update model         
        scope.$apply(function() {
          var html = element.html();
          html = TerribleStuff.cleanContent(html); //cleanup angular tags and empty components inner HTML
          ngModel.$setViewValue(html);
        });
      });

      // model -> view
      ngModel.$render = function() {
        element.html(ngModel.$viewValue);
        //upon first load compile all directives
        //TODO: make sure it doesn't happen too often
        $compile(element.contents())(scope);
      };

      //on click, set it as the current edited directive
      element.bind('click', function() {
        scope.$apply(function(){
            $rootScope.$broadcast('setElementFocus',element);
        });
      });

      //listen for requests of recompiling contents
      scope.$on('compileDirectives', function() {
        $compile(element.contents())(scope);
      });
    }
  };
});