const VERSION='problemia-local-v3';
const FILES=['./','index.html','styles.css','favicon.svg','app.js','app-fix.js','learning-profile.js','problem-engine.js','story-bank.js','advanced-bank.js','logic-bank.js','release.js','reasoning.js','materials.js','languages.js','offline.js','font-data.js','vendor/jspdf.umd.min.js','fonts/Borel-Regular.ttf','fonts/DMSans.ttf','fonts/SpaceGrotesk.ttf'];
FILES.push('early-reading-bank.js');
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('problemia-local-')&&key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  if(event.request.mode==='navigate')event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(VERSION).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match(new URL('index.html',self.registration.scope)))));
  else event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
