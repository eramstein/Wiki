'use strict';

/*
    Handles reading and editing articles, indluding the <data>, <cont> and <cons> directives

*/

app.controller('ArticleEditCtrl', function ($scope, $routeParams, $rootScope, Article, Triplet, Component, Template, DSM, TerribleStuff) {

    //-------------------------------------------------------------------
    // FIREBASE binding to the article
    //-------------------------------------------------------------------
    var articleRemote = Article.find($routeParams.articleId);
    articleRemote.$bind($scope, 'article');

    //-------------------------------------------------------------------
    // CONFIG & DEFAULT values
    //-------------------------------------------------------------------
    $scope.defaultPredicate = "";

    //-------------------------------------------------------------------
    // STATE handling
    //-------------------------------------------------------------------
    $scope.state = {
        "selectedText":"",
        "cursorPos":"",
        "editedElement":null
    };
    $scope.state.startAdvancedEditing = function () {
        $scope.state.editedElement = event.target;
    };
    $scope.$on('setElementFocus', function(event, sourceElem) {
        $scope.state.editedElement = sourceElem[0];
      });

    //-------------------------------------------------------------------
    // TEMPLATE handling
    //-------------------------------------------------------------------
    $scope.template = {
        "name":"",
        "entityType":"",
        "created":false
    };
    //update(): uses the current values of $scope.template to create new template in the database, and then assign it to the article
    $scope.template.update = function () {
        var newTemplate = {
            "name":this.name,
            "entityType":this.entityType,
            "content":$scope.article.content
        };
        Template.create(newTemplate, this.assignToArticle);
    };
    //assignToArticle(): add reference to the template on the article object, and asks for an entity name
    //note: due to the way this is instantiated by the template service, the "this" keyword won't work in this method
    $scope.template.assignToArticle = function (templateId) {
        $scope.article.template = {
            "id":templateId,
            "name":$scope.template.name
        };
        //this will show a form to add entity name
        $scope.template.created = true;
    };
    $scope.template.exit = function () {
        this.name = "";
        this.entityType = "";
        this.created = false;
        this.closemodal();
    };
    $scope.template.openmodal = function () {
        angular.element('#template-flyout').modal('show');
    };
    $scope.template.closemodal = function () {
        angular.element('#template-flyout').modal('hide');
    };

    //-------------------------------------------------------------------
    // TOOLTIP handling
    //-------------------------------------------------------------------
    $scope.tooltip = {
        "show":false,
        "text":"",
        "topPos":0,
        "leftPos":0
    };
    $scope.$on('showDirTooltip', function(event, sourceElem, text) {
        if(!$scope.tooltip.show){
            var tooltip = angular.element("#directive-tooltip");
            $scope.tooltip.show = true;
            $scope.tooltip.text = text;
            $scope.tooltip.topPos = (sourceElem.context.offsetTop - 2) + "px";
            $scope.tooltip.leftPos = (sourceElem.context.offsetLeft + sourceElem.context.offsetWidth + 3) + "px";
        }
      });
    $scope.$on('hideDirTooltip', function(event) {
        $scope.tooltip.show = false;
      });


    //-------------------------------------------------------------------
    // DIRECTIVES creation & interactions (forms handling, event listeners...)
    //-------------------------------------------------------------------
    $scope.editedDirective = null;
    $scope.editedTriplet = null;

    //<DATA>
    //-------------------------------------------------------------------
    $scope.datadir = {
        "object":"",
        "subject":"",
        "predicate":""
    };
    //exit(): close the modal and reset state
    $scope.datadir.exit = function () {
        this.closemodal();
        $scope.editedDirective = null;
        $scope.editedTriplet = null;
    };
    //update(): uses the current values of $scope.datadir to create or update a triplet, and then update the directive's HTML on callback
    $scope.datadir.update = function(){
        //add or update triplet in the database, and update directive on callback
        //Triplet.create will pass the newly created triplet Id to the callback
        var triplet = {
            "p":this.predicate,
            "o":this.object,
            "s":this.subject
        };
        if ($scope.editedTriplet){
            Triplet.update($scope.editedTriplet, triplet, this.updateHTML);
        }
        else {
            Triplet.create(triplet, this.updateHTML);
        }
    };
    //updateHTML(): update the directive HTML within $scope.article.content
    //a triplet Id has to be passed so that a reference to the triplet in the database gets presisted in the directive's attributes
    $scope.datadir.updateHTML = function(tripletId){
        var oldContent;
        var newcontent;
        var directive = '<data t="'+tripletId+'" p="'+$scope.datadir.predicate+'" s="'+$scope.datadir.subject+'">' + $scope.datadir.object + '</data>';
        //if a directive is currently being edited, replace it with the new values
        if ($scope.editedDirective){
            oldContent = TerribleStuff.cleanContent($scope.previousDirectiveValue.outerHTML);
            $scope.article.content = $scope.article.content.replace(oldContent, directive);
        }
        //else, if text is selected, put directive around it
        else if($scope.state.selectedText){
            oldContent = $scope.article.content;
            newcontent = oldContent.substr(0,$scope.state.cursorPos);
            newcontent += directive;
            newcontent += oldContent.substr($scope.state.cursorPos + $scope.datadir.object.length);
            $scope.article.content = newcontent;
        }
        //close form
        $scope.datadir.exit();
    };
    //openform(): used to make selected text a data directive
    //note selected text and cursor position, set default values and open the form to edit the directive
    $scope.datadir.openform = function () {
        if($scope.state.editedElement){
            $scope.state.selectedText = DSM.getSelectionTextarea($scope.state.editedElement);
            $scope.state.cursorPos = DSM.getCaretTextarea($scope.state.editedElement);
            this.subject = $scope.article.entity;
            this.predicate = $scope.defaultPredicate;
            this.object = $scope.state.selectedText;
            this.openmodal();
        }
    };
    //modal form handling
    $scope.datadir.openmodal = function () {
        angular.element('#data-flyout').modal('show');
    };
    $scope.datadir.closemodal = function () {
        angular.element('#data-flyout').modal('hide');
    };
    //when a <data> directive is clicked, set scope values from the current directive's attributes and open the form to edit the directive
    $scope.$on('showDataForm', function(event, sourceElem, subject, predicate, triplet) {
        $scope.editedDirective = sourceElem[0];
        $scope.editedTriplet = triplet;
        $scope.previousDirectiveValue = sourceElem[0];
        $scope.datadir.object = sourceElem[0].innerText;
        $scope.datadir.subject = subject || $scope.article.entity;
        $scope.datadir.predicate = predicate;
        $scope.datadir.openmodal();
      });


    //<CONS>
    //-------------------------------------------------------------------
    $scope.consdir = {
        "list":[],
        "selected":null
    };
    //openform(): note cursor position, fill list of constructors and open the form to edit the directive
    $scope.consdir.openform = function () {
        if(this.list.length===0){
            this.list = Component.constructors;
        }
        if($scope.state.editedElement){
            $scope.state.cursorPos = DSM.getCaretTextarea($scope.state.editedElement);
            this.openmodal();
        }
    };
    //modal form handling
    $scope.consdir.openmodal = function () {
        angular.element('#cons-flyout').modal('show');
    };
    $scope.consdir.closemodal = function () {
        angular.element('#cons-flyout').modal('hide');
    };
    //insert construct
    $scope.consdir.insert = function () {
        var oldContent;
        var newcontent;
        var attributesString = '';
        var directive = '';
        var attributes = this.selected.attrs;
        //build the directive
        angular.forEach(attributes, function(value, key){
               attributesString += key + '="' + value.value + '"';
             });
        directive = '<cons><' + this.selected.name + ' ' + attributesString + '></' + this.selected.name + '></cons>';
        //insert it
        oldContent = $scope.article.content;
        newcontent = oldContent.substr(0,$scope.state.cursorPos);
        newcontent += directive;
        newcontent += oldContent.substr($scope.state.cursorPos);
        $scope.article.content = newcontent;
        this.closemodal();
    };
    //close the modal and reset state
    $scope.consdir.exit = function () {
        this.closemodal();
        this.selected = null;
        $scope.editedDirective = null;
    };

    //<CONT>
    //-------------------------------------------------------------------
    $scope.contdir = {
        "list":[],
        "selected":null,
        "content":""
    };
    //openform(): note cursor position, fill list of containers and open the form to edit the directive
    $scope.contdir.openform = function () {
        if(this.list.length===0){
            this.list = Component.containers;
        }
        if($scope.state.editedElement){
            $scope.state.cursorPos = DSM.getCaretTextarea($scope.state.editedElement);
            this.openmodal();
        }
    };
    //modal form handling
    $scope.contdir.openmodal = function () {
        angular.element('#cont-flyout').modal('show');
    };
    $scope.contdir.closemodal = function () {
        angular.element('#cont-flyout').modal('hide');
    };
    //insert container
    $scope.contdir.insert = function () {
        var oldContent;
        var newcontent;
        var attributesString = '';
        var directive = '';
        var attributes = this.selected.attrs;
        //build the directive
        angular.forEach(attributes, function(value, key){
               attributesString += key + '="' + value.value + '"';
             });
        directive = '<' + this.selected.name + ' ' + attributesString + '>' + this.content + '</' + this.selected.name + '>';
        directive = '<cont content=\'' + encodeURIComponent(directive) + '\'>' + directive + '</cont>';
        //insert it
        oldContent = $scope.article.content;
        newcontent = oldContent.substr(0,$scope.state.cursorPos);
        newcontent += directive;
        newcontent += oldContent.substr($scope.state.cursorPos);
        $scope.article.content = newcontent;
        this.closemodal();
    };
    //add a field to the template (just append a div)
    $scope.contdir.addToTemplate = function (field) {
        this.content += "<div>{{"+field.accessor+"}}</div>";
    };
    //close the modal and reset state
    $scope.contdir.exit = function () {
        this.closemodal();
        this.selected = null;
        this.content = "";
        $scope.editedDirective = null;
    };

    //-------------------------------------------------------------------
    // MISC functions
    //-------------------------------------------------------------------
    $scope.compileAll = function () {
        $rootScope.$broadcast('compileDirectives');
    };

  });

