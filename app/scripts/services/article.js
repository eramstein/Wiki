'use strict';

app.factory('Article', function ($firebase, FIREBASE_URL, User, Template) {
    var ref = new Firebase(FIREBASE_URL + 'articles');
    var articles = $firebase(ref);

    var Article = {
        all: articles,
        create: function (article) {
            if (User.signedIn()) {
                var user = User.getCurrent();
                article.author = user.username;
                if(article.template){
                    article.content = article.template.content;
                    //TODO: we should also store the Id
                    article.template = {
                        "name":article.template.name
                    };
                }
                article.tags = '';

                return articles.$add(article).then(function (ref) {
                    var articleId = ref.name();
                    user.$child('articles').$child(articleId).$set(articleId);
                    return articleId;
                });
            }
        },
        find: function (articleId) {
          return articles.$child(articleId);
        },
        delete: function (articleId) {
          if (User.signedIn()) {
            var article = Article.find(articleId);

            article.$on('loaded', function () {
              var user = User.findByUsername(article.author);

              articles.$remove(articleId).then(function () {
                user.$child('articles').$remove(articleId);
              });
            });
          }
        }
    };

    return Article;
  });
