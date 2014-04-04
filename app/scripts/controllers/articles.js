'use strict';

app.controller('ArticleCtrl', function ($scope, $location, Article, Template) {
    $scope.articles = Article.all;
    $scope.templates = Template.all;
    $scope.article = {title: ''};

    $scope.deleteArticle = function (articleId) {
        Article.delete(articleId);
    };

    $scope.createArticle = function () {
      $scope.closeArticleCreationModal();
      Article.create($scope.article).then(function (articleId) {
        $location.path('/articles/' + articleId);
      });
    };

    $scope.openArticleCreationModal = function() {
        angular.element('#new-article-flyout').modal('show');
    };

    $scope.closeArticleCreationModal = function () {
        angular.element('#new-article-flyout').modal('hide');
    };

  });
