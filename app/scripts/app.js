/* global app:true */
'use strict';

var app = angular.module('wikiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase'
]);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/articles.html',
        controller: 'ArticleCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl'
      })
      .when('/articles/:articleId', {
        templateUrl: 'views/article-edit.html',
        controller: 'ArticleEditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
.constant('FIREBASE_URL', 'https://etiennewiki.firebaseio.com/');
