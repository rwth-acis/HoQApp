if (workbox) {
  console.log(`Workbox loaded!`);
  workbox.precaching.precacheAndRoute([]);


  const bgSyncPlugin = new workbox.backgroundSync.Plugin('failed-requests');

  const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  });

  // routes handled by the background sync plugin
  const hoqURL = 'https://hoq.tech4comp.dbis.rwth-aachen.de/api';
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
  console.log(`Workbox didn't load.`);
}
