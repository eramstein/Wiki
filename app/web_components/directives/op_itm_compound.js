'use strict';

app.directive('itmCompound', function(OpenPhacts) {
  return {
    restrict: 'E',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: {'item': '@'},
    link: function(scope, elm, attrs) {
        //get URI of the compound
        OpenPhacts.getURI(scope.item).then(function (compoundURI) {
            return compoundURI;
        })
        //use it to get info about that compound
        .then(function (compoundURI) {
            return OpenPhacts.getCompound(compoundURI);
        })
        //update directive's transcluded template's scope with the OpenPhacts information (the transcluded template is $$nextSibling)
        .then(function (data) {
             for (var attrname in data) {
              scope.$$nextSibling[attrname] = data[attrname];
            }
        });
    }
  };
});