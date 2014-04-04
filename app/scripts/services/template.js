'use strict';

app.factory('Template', function ($firebase, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL + 'templates');
    var templates = $firebase(ref);

    var Template = {
        all: templates,
        create: function (template, callback) {
            //update all <data> directives to remove subject and triplet Id (let the user reset them when new instances of this template are created)
            template.content = template.content.replace(/(<data\s+.*?t=").*?(".*)/gi, "$1$2");
            template.content = template.content.replace(/(<data\s+.*?s=").*?(".*)/gi, "$1$2");
            //create template
            return templates.$add(template).then(function (ref) {
              var templateId = ref.name();
              callback(templateId);
            });
        },
        find: function (templateId) {
          return templates.$child(templateId);
        },
        update: function (templateId, newValue, callback) {
          return templates.$child(templateId).$set(newValue).then(function (ref) {
              callback(templateId);
            });
        },
        delete: function (templateId) {
            var template = Template.find(templateId);
            template.$on('loaded', function () {
              templates.$remove(templateId);
            });
        }
    };

    return Template;
  });
