'use strict';

app.directive('wdgCompound', function(OpenPhacts) {
  return {
    restrict: 'E',
    scope: {'item': '@'},
    templateUrl: 'web_components/views/op_compound.html',
    link: function(scope, elm, attrs) {
        //get URI of the compound
        OpenPhacts.getURI(scope.item).then(function (compoundURI) {
            return compoundURI;
        })
        //use it to get info about that compound
        .then(function (compoundURI) {
            return OpenPhacts.getCompound(compoundURI);
        })
        //update directive's scope with the OpenPhacts information
        .then(function (data) {
            scope.data = data;
        });
    }
  };
});