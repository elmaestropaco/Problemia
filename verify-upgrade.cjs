/* Uso: node verify-upgrade.cjs RUTA_A_UNA_PUBLICACION_ANTERIOR */
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
let pw;try{pw=require('playwright')}catch{pw=require('C:/Users/Paco/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright')}
(async()=>{
 if(!process.argv[2])throw Error('Indica la ruta de una publicación anterior para probar la actualización.');
 const oldRoot=path.resolve(process.argv[2]||'Problemia-GitHub'),newRoot=process.cwd();
 const expectedVersion=fs.readFileSync(path.join(newRoot,'sw.js'),'utf8').match(/const VERSION='([^']+)'/)[1];
 if(oldRoot===newRoot||!fs.existsSync(path.join(oldRoot,'index.html')))throw Error('Indica una carpeta con una versión anterior completa.');
 let upgraded=false;
 const server=http.createServer((req,res)=>{const root=upgraded?newRoot:oldRoot,pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/problemia\//,'');const file=path.resolve(root,pathname||'index.html');if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return}res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await pw.chromium.launch({headless:true}),context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(`http://127.0.0.1:${server.address().port}/problemia/`);await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await page.evaluate(()=>{state.data.reading.font='school';state.data.materials.push({id:'upgrade-material',title:'Conservar este material',grade:'P1',problems:[]});persist()});
  upgraded=true;await page.reload();let latest=false;
  for(let attempt=0;attempt<50&&!latest;attempt++){
    try{latest=await page.evaluate(expectedVersion=>new Promise(resolve=>{const worker=navigator.serviceWorker.controller;if(!worker){resolve(false);return}const channel=new MessageChannel();const timer=setTimeout(()=>{channel.port1.close();resolve(false)},200);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();resolve(event.data===expectedVersion)};worker.postMessage('problemia-version',[channel.port2])}),expectedVersion);}catch{}
    if(!latest)await page.waitForTimeout(100);
  }
  assert(latest,'No se ha activado la versión nueva');await page.waitForLoadState();
  await page.reload();await context.setOffline(true);await page.reload();await page.locator('[data-view="generator"]').first().click();assert.equal(await page.locator('#operationMode').count(),1);await page.locator('#operationMode').selectOption('mixed');await page.locator('#generatorForm button[type="submit"]').click();assert.equal(await page.locator('.problem-card').count(),10);assert(await page.evaluate(()=>state.data.materials.some(m=>m.id==='upgrade-material')));assert(await page.locator('body').evaluate(e=>e.classList.contains('font-school')));
  const diagnostics=await page.evaluate(async expectedVersion=>({versions:await caches.keys(),unverified:state.problems.some(p=>!p.verifiedOperations?.length),bad:state.problems.filter(p=>p.statement.includes('cada recipiente')||p.statement.includes('quedan para usar ahora')).map(p=>p.statement),cached:await caches.open(expectedVersion).then(c=>c.match(new URL('story-bank.js',location.href),{ignoreSearch:true})).then(r=>r?r.text():'MISSING').then(s=>s==='MISSING'?'MISSING':s.includes('StoryLanguage.shipment')),script:[...document.scripts].find(s=>s.src.includes('story-bank')).src}),expectedVersion);
  assert.equal(diagnostics.bad.length,0,JSON.stringify(diagnostics));assert.equal(diagnostics.unverified,false,'La nueva validación de operaciones no está cargada');await page.evaluate(()=>{document.dispatchEvent(new Event('input'));navigator.serviceWorker.dispatchEvent(new Event('controllerchange'))});assert.equal(await page.locator('#updateApplicationButton').count(),1);assert.deepEqual(errors,[]);console.log(JSON.stringify({upgrade:true,offlineMixed:true,materialsPreserved:true,fontPreserved:true,consoleErrors:0},null,2));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exit(1)});
