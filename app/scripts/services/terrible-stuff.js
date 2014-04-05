'use strict';

// some horrible code that will most likely break one day
// kept all here in case someone wants to make this prototype productive (still, check the rest of the code, there might be more :p)

app.factory('TerribleStuff',
  function () {

    var TerribleStuff = {
      cleanContent: function (html) {
        var cleanHTML = html;        
        //remove inner HTML of the components (this is generated at runtime by the directives and doesn't need to be saved in the database)
        //first create a div to use the DOM's HTML parser (trying to do that with regexp would be painful, error prone and evil)
        var div = document.createElement("div");
        div.innerHTML = cleanHTML;
        //for constructors, we simply cleanup their child's content
        var constructors = div.getElementsByTagName("cons");
        var contentToRemove = "";
        angular.forEach(constructors, function(cons, key){
               contentToRemove = cons.children[0].innerHTML;
               cleanHTML = cleanHTML.replace(contentToRemove, "");
             });
        //for containers, we cleanup their content and re-insert the template that was stored in the content attribute
        var containers = div.getElementsByTagName("cont");
        var contentToRestore = "";
        var contentToReplace = "";
        angular.forEach(containers, function(cont, key){
               contentToReplace = cont.outerHTML;
               contentToRemove = cont.innerHTML;
               contentToRestore = contentToReplace.replace(contentToRemove, decodeURIComponent(cont.getAttribute("content")));
               cleanHTML = cleanHTML.replace(contentToReplace, contentToRestore);      
             });
        //after rendering ngModel angular adds spans and classes to keep track of the various scopes
        //we don't want to store that in the database but I didn't find how to prevent angular to add this (and it might be a bad idea to prevent it anyways)
        cleanHTML = cleanHTML.replace(/<span class=\"ng-scope\">/g, "");
        cleanHTML = cleanHTML.replace(/ class=\"ng-scope ng-isolate-scope\"/g, "");
        cleanHTML = cleanHTML.replace(/ class=\"ng-scope\"/g, "");
        cleanHTML = cleanHTML.replace(/ class=\"ng-isolate-scope\"/g, "");
        cleanHTML = cleanHTML.replace(/<\/span>/g, "");
        return cleanHTML;
      }
    };

    return TerribleStuff;
  });