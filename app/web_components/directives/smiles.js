'use strict';

app.directive('wdgSmilesViz', function(OpenPhacts, $sce) {
  return {
    restrict: 'E',
    scope: {'smiles': '@'},
    template: '<iframe ng-src="{{url}}" frameborder="0" border="0" cellspacing="0" style="border-style: none;width: 270px; height: 200px;"></iframe>',
    link: function(scope, elm, attrs) {
        scope.$watch('smiles', function () {
            if(scope.smiles){
                scope.url = $sce.trustAsResourceUrl("http://pasilla.health.unm.edu/tomcat/biocomp/mol2img?mode=cow&imgfmt=png&kekule=true&use2d=true&transparent=true&clearqprops=TRUE&h=180&w=260&smiles="+scope.smiles);
            }
        });
    }
  };
});