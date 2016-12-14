/*Service worker script
After a controlled page kicks off the registration process, let's shift to the point of view of the service worker script, which handles the install event.
Inside of our install callback, we need to take the following steps:
1. Open a cache.
2. Cache our files.
3. Confirm whether all the required assets are cached or not.
*/

var CACHE_NAME = 'pages-cache-v1';
var urlsToCache = [
  '/my-first-project/',
  '/my-first-project/test-styles/main.css',
  '/my-first-project/test-scripts/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

//After a service worker is installed and the user navigates to a different page or refreshes, the service worker will begin to receive fetch events
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        console.log('fetch event');
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

/*
If we want to cache new requests cumulatively, we can do so by handling the response of the fetch request and then adding it to the cache, like below.
What we are doing is this:
1. Add a callback to .then() on the fetch request.
2. Once we get a response, we perform the following checks:
3. Ensure the response is valid.
4. Check the status is 200 on the response.
6. Make sure the response type is basic, which indicates that it's a request from our origin. This means that requests to third party assets aren't cached as well.
7. If we pass the checks, we clone the response. The reason for this is that because the response is a Stream, the body can only be consumed once. Since we want to return the response for the browser to use, as well as pass it to the cache to use, we need to clone it so we can send one to the browser and one to the cache.
*/
/*
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        console.log('cache new requests cumulatively');
        // Cache hit - return response
        if (response) {
          return response;
        }
        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
    );
});
*/

/*
Update service worker
1. Update your service worker JavaScript file. When the user navigates to your site, the browser tries to redownload the script file that defined the service worker in the background. If there is even a byte's difference in the service worker file compared to what it currently has, it considers it new.
2. Your new service worker will be started and the install event will be fired.
3. At this point the old service worker is still controlling the current pages so the new service worker will enter a waiting state.
4. When the currently open pages of your site are closed, the old service worker will be killed and the new service worker will take control.
5. Once your new service worker takes control, its activate event will be fired.
*/
self.addEventListener('activate', function(event) {
  console.log('activate');
  var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
			console.log('cacheName: ',cacheName);
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
