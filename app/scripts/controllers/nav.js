'use strict';

app.controller('NavCtrl', function ($scope, $location, Article, Auth) {

    $scope.logout = function () {
      Auth.logout();
    };

    $scope.login = function () {
      $location.path('/login');
    };

  });