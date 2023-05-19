'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.json": "dffaf98259acb84c942179e6c51a59b7",
"assets/AssetManifest.smcbin": "fb96619cdd20c621f7b19da9354e72ad",
"assets/assets/1024.png": "39c309b3a2d0eb883689472a677d634a",
"assets/assets/background_image.jpeg": "b98dfd0bd6700ba5fb36879871274816",
"assets/assets/dart.png": "1aef77e06bc23c58240a192da2fb596f",
"assets/assets/facebook.png": "021ada146ffb7c1753557ff29618d04c",
"assets/assets/firebase.png": "58e6d473926b5879eaa0c2da7e7b0622",
"assets/assets/flutter.png": "f665f82210a707dbba076f5c6dc589ae",
"assets/assets/giphy1.gif": "cad5918d86b6a7e83f1fb4acead70e4c",
"assets/assets/git.png": "e3c2eda0cce98feb7cb6a88afdde5c8b",
"assets/assets/github.png": "dcf16ddd7921830ac42ade17aca0679b",
"assets/assets/images/project_1.png": "91900fb6b55a2effd2e342117ddda6e5",
"assets/assets/images/project_2.jpg": "b64f04a3018930c5abd98a8dede6c380",
"assets/assets/images/project_3.png": "f78b87663b1e89a68a0d3565eb4a7366",
"assets/assets/images/project_4.jpg": "8f2ed20ea8a0670d8100a865d6ad73e8",
"assets/assets/images/project_5.webp": "940b9988cb889e3e19eca82d9af9d36e",
"assets/assets/instagram.png": "5c570427ee23f69853d28aec805eee79",
"assets/assets/json.png": "bf587f1429bf8c7a9f436c5b95fe0b92",
"assets/assets/linkedin.png": "d492efc706db983e74258dbd348f2208",
"assets/assets/linux.png": "e9a5a994103a66276dbbe0fb684059b3",
"assets/assets/mail.png": "2d46798234bb64d2db71f54b73868f57",
"assets/assets/my_black_white.png": "54d4737f629596064024988d07e58c70",
"assets/assets/my_logo.png": "0b3b9abc76a57bfe1b1232e178282cf1",
"assets/assets/welcome.png": "3c37e666e41644ea9e862ced84a39eef",
"assets/assets/welcome_text.gif": "1692533db2985b65a6d5ef1fb9534a96",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "c08bafc56739cfa867ae924596afd136",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "45bec3a754fba62b2d8f23c38895f029",
"canvaskit/canvaskit.wasm": "0d1971e11a8183c2f8043b5e686d4cc4",
"canvaskit/chromium/canvaskit.js": "6bdd0526762a124b0745c05281c8a53e",
"canvaskit/chromium/canvaskit.wasm": "adf6e872ecef974ac963dfbee4f041dc",
"canvaskit/skwasm.js": "9265c6c0cdc6b28cff3e81701d8fd707",
"canvaskit/skwasm.wasm": "db1354e7167ab2d144fbf7cb788bb43d",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.png": "39c309b3a2d0eb883689472a677d634a",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "b3b21395ac9d98e17da79b62b60f594d",
"/": "b3b21395ac9d98e17da79b62b60f594d",
"main.dart.js": "b1077ac802b7f547c647fb8c31ede050",
"main.dart.mjs": "9bb2a77aa4a0c5be26903117e90ee1e4",
"main.dart.wasm": "c2ba90097bfa15ce9b474d8c3656dbcd",
"manifest.json": "3be6677704c7be573ae4853e00d1fe8e",
"splash/splash.js": "123c400b58bea74c1305ca3ac966748d",
"splash/style.css": "cbd53cd601ee4cb081e77dd37414f2ff",
"version.json": "84fd165e33b1e46b0ec2efd5a6d64f69"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
