//Register a sevice worker
if ('serviceWorker' in navigator) {
console.log('serviceWorker is in navigator');
  window.addEventListener('load', function() {
  /*
  * You'll notice in this case that the service worker file is at the root of the domain. This means 
  * that the service worker's scope will be the entire origin. In other words, this service worker will
  * receive fetch events for everything on this domain. If we register the service worker file at 
  * /example/sw.js, then the service worker would only see fetch events for pages whose URL starts with /example/ 
  * (i.e. /example/page1/, /example/page2/).
  */
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
} else {
console.log('serviceWorker is not in this navigator');
}