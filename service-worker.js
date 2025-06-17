const CACHE_NAME = 'vocab-bonanza-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'vocab.js',
  'https://fonts.googleapis.com/css2?family=Bangers&family=Short+Stack&display=swap',
  // Real images for icons
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Big_Ben_Clock_Face_Panorama.jpg/48px-Big_Ben_Clock_Face_Panorama.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Big_Ben_Clock_Face_Panorama.jpg/72px-Big_Ben_Clock_Face_Panorama.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Big_Ben_Clock_Face_Panorama.jpg/96px-Big_Ben_Clock_Face_Panorama.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Big_Ben_Clock_Face_Panorama.jpg/144px-Big_Ben_Clock_Face_Panorama.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Big_Ben_Clock_Face_Panorama.jpg/168px-Big_Ben_Clock_Face_Panorama.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Big_Ben_Clock_Face_Panorama.jpg/192px-Big_Ben_Clock_Face_Panorama.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Big_Ben_Clock_Face_Panorama.jpg/512px-Big_Ben_Clock_Face_Panorama.jpg'
];

// Install event: cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve from cache or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request).catch(() => {
          // If network also fails, you can return a fallback page
          // For now, it will just throw a network error
          console.error('Fetch failed and no cache match for:', event.request.url);
          // Example: return caches.match('offline.html'); if you have an offline page
        });
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
