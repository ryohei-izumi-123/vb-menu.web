const APP_PREFIX = '_VBMENU_'
const VERSION = '20.0.7'
const CACHE_NAME = `${APP_PREFIX}${VERSION}`
const URLS = serviceWorkerOption ? serviceWorkerOption.assets : []
const Logger = (str) => console.log(`[SW]: ${str}`)
self.addEventListener('fetch', e => {
  Logger(`Fetch request : ${e.request.url}`)
  e.respondWith(
    caches.match(e.request).then(request => {
      if (request) {
        Logger(`Responding with cache : ${e.request.url}`)
        return request
      } else {
        Logger(`File is not cached, fetching : ${e.request.url}`)
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      Logger(`Installing cache : ${CACHE_NAME}`)
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      let cacheWhitelist = keyList.filter(key => key.indexOf(APP_PREFIX))
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(
        keyList.map((key, i) => {
          if (cacheWhitelist.indexOf(key) === -1) {
            Logger(`Deleting cache : ${keyList[i]}`)
            return caches.delete(keyList[i])
          }
        })
      )
    })
  )
})
