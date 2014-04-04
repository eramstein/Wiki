'use strict';

app.factory('Triplet', function ($firebase, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL + 'triplets');
    var triplets = $firebase(ref);

    var Triplet = {
        all: triplets,
        create: function (triplet, callback) {
            return triplets.$add(triplet).then(function (ref) {
              var tripletId = ref.name();
              callback(tripletId);
            });
        },
        find: function (tripletId) {
          return triplets.$child(tripletId);
        },
        update: function (tripletId, newValue, callback) {
          return triplets.$child(tripletId).$set(newValue).then(function (ref) {
              callback(tripletId);
            });
        },
        delete: function (tripletId) {
            var triplet = Triplet.find(tripletId);
            triplet.$on('loaded', function () {
              triplets.$remove(tripletId);
            });
        }
    };

    return Triplet;
  });
