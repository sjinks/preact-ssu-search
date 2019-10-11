/* global workbox */
const isNav = event => event.request.mode === "navigate";

workbox.routing.registerRoute(
    ({ event }) => isNav(event),
    new workbox.strategies.NetworkFirst({
        cacheName: workbox.core.cacheNames.precache,
        networkTimeoutSeconds: 5,
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [200]
            })
        ]
    })
);

// eslint-disable-next-line no-underscore-dangle
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(
    /^https:\/\/cors-proxy\.wildwolf\.name\//,
    new workbox.strategies.CacheFirst({
        cacheName: "ssu-search-cache-cors",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 1000,
                maxAgeSeconds: 600
            })
        ]
    })
);

workbox.routing.registerRoute(
    /^https:\/\/ssu\.gov\.ua\/ua\/find\//,
    new workbox.strategies.CacheFirst({
        cacheName: "ssu-search-cache",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 1000,
                maxAgeSeconds: 600
            })
        ]
    })
);

workbox.routing.registerRoute(
    /^https:\/\/ssu\.gov\.ua\/uploads\//,
    new workbox.strategies.CacheFirst({
        cacheName: "ssu-image-cache",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 1000,
                maxAgeSeconds: 3600
            })
        ]
    })
);

workbox.routing.setCatchHandler(({ event }) => {
    if (isNav(event)) {
        return caches.match(
            workbox.precaching.getCacheKeyForURL("/index.html")
        );
    }

    return Response.error();
});
