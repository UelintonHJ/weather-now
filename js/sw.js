self.addEventListener("install", event => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open("weather-cache-v1");

            const assets = [
                "/",
                "/index.html",
                "/style.css",
                "/js/script.js",
                "/manifest.json",
                "js/vendor/lottie-player.js"
            ];

            await Promise.all(
                assets.map(async asset => {
                    try {
                        await cache.add(asset);
                    } catch (err) {
                        console.warn("Falha ao cachear:", asset);
                    }
                })
            );
        })()
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});