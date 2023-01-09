
const cacheName = 'sound-pwa-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/sound.mp3',
  '1_root.mp3',
  '2_sacral.mp3',
  '3_solar_plexus.mp3',
  '4_heart.mp3',
  '6_eye.mp3',
  '5_throat.mp3',
  '7_crown.mp3',
];

self.addEventListener('install', event => {
  console.log('Installing service worker');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating service worker');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName) {
          console.log('Deleting old cache');
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});