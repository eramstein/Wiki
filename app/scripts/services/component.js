'use strict';

app.factory('Component', function ($firebase, FIREBASE_URL) {
    var refConstructors = new Firebase(FIREBASE_URL + 'components/constructors');
    var constructors = $firebase(refConstructors);
    var refContainers = new Firebase(FIREBASE_URL + 'components/containers');
    var containers = $firebase(refContainers);

    var Component = {
        constructors: constructors,
        containers: containers
        
    };

    return Component;
  });
