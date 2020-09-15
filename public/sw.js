const staticCacheName = 'static-cache-v36';
const dynamicCacheName = 'dynamic-cache-v10';

const assets = [
    '/',
    '/index.html',
    '/pages/update.html',
    '/js/ui.js',
    '/js/app.js',
    '/css/styles.css',
    '/css/materialize.css',
    '/css/materialize.min.css',
    '/js/materialize.min.js',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html',
    '/js/db.js'
];

// cache limit size function
const limitCacheSize = (name, size)=>{
    caches.open(staticCacheName).then(cache=>{
        // here cache.keys() returns all the individual assets or requests in that particular cache
        cache.keys().then(keys => {
           if(keys.length > size){
               cache.delete(keys[0]).then(limitCacheSize(cache, size));
           }
        });
        });
}

//install event - create cache
self.addEventListener('install', evt => {
    //console.log('service worker is installed !!')
    
    evt.waitUntil(
    caches.open(staticCacheName).then((cache)=>{
        console.log('caching all assets');
        cache.addAll(assets);
    })
    );
});


//activate event
self.addEventListener('activate', evt => {
    // console.log('service worker is activated !')
    evt.waitUntil(
    caches.keys().then((keys)=>{
        //console.log(keys); here it returns all the caches within cache storage [staticCacheName , dynamicCacheName]
            keys.filter(
                key => key != staticCacheName && key != dynamicCacheName
            ).map(
                key => caches.delete(key)
            )
        })
    
    );
});


// fetch event
self.addEventListener('fetch', evt =>{
    // console.log(evt)
    // evt.request - is object with method and url as properties
    // check whether requeste url is within cache if its not there then add it in dynamic cache and at the same time return response to user
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
        evt.respondWith(
            caches.match(evt.request).then((cacheRes)=>{
                return cacheRes || fetch(evt.request).then((fetchRes)=>{
                    return caches.open(dynamicCacheName).then((cache)=>{
                    cache.put(evt.request.url, fetchRes.clone());
                    //check cache size
                    limitCacheSize(cache, 20);
                    return fetchRes;
                })
            });
        
        }).catch((err)=>{
            if(evt.request.url.indexOf('.html') > -1 ){
            return caches.match('/pages/fallback.html');
            }
        })
    );
    }
});