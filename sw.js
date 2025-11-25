import { warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';


self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => clients.claim());

registerRoute(
  ({ url }) =>
    url.hostname.includes("google.com") ||
    url.hostname.includes("gstatic.com") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("maps.googleapis.com"),
  new StaleWhileRevalidate({
    cacheName: "ignored-google-maps",
  })
);


const pageCache = new CacheFirst({
  cacheName: 'pwa-geoloc-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);


registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);


registerRoute(
  ({ request, url }) =>
    request.destination === 'image' &&
    !url.hostname.includes("google"),
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

