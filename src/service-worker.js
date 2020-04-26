if (workbox) {
  console.log(`Workbox loaded!`);
  workbox.precaching.precacheAndRoute([]);


  const bgSyncPlugin = new workbox.backgroundSync.Plugin('failed-requests');

  const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  });

  const hoqURL = 'https://hoq-app-backend.herokuapp.com/api';
  workbox.routing.registerRoute(
    hoqURL + '/tech-specifications/',
    networkWithBackgroundSync,
    'POST'
  );
  workbox.routing.registerRoute(
    hoqURL + '/tech-specifications/',
    networkWithBackgroundSync,
    'PUT'
  );
  workbox.routing.registerRoute(
    hoqURL + '/tech-specifications/',
    networkWithBackgroundSync,
    'DELETE'
  );
  workbox.routing.registerRoute(
    hoqURL + '/products/',
    networkWithBackgroundSync,
    'PUT'
  );

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
