const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
let playwright;try{playwright=require('playwright')}catch{playwright=require('C:/Users/Paco/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright')}
const {chromium}=playwright;
(async()=>{
 const root=process.cwd();const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/problemia\//,'');const file=path.resolve(root,pathname===''?'index.html':pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404).end();return;}const ext=path.extname(file);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.ttf':'font/ttf'})[ext]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}/problemia/`;
 const browser=await chromium.launch({headless:true}),context=await browser.newContext({acceptDownloads:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
 await page.goto(url);
 const report=await page.evaluate(()=>{
   let count=0;const topics=['decimal','fraction','percent','geometry','measure','proportion','divisibility','power','root','equation','logic'];
   for(const topic of topics)for(const difficulty of ['easy','medium','hard','challenge'])for(const arithmetic of [[],['add','subtract','multiply','divide']]){
     const c={grade:'E2',difficulty,operations:[topic,...arithmetic],quantity:3,theme:'varied',allowCarries:true,allowNegative:false,divisionMode:'mixed',seed:topic+difficulty+arithmetic.join()};
     const problems=generate(c);if(problems.length!==3)throw Error('Lote incompleto '+topic);
     for(const p of problems){const model=p.mathematicalModel,result=AdvancedBank.solve(model.tree,[]);if(JSON.stringify(result)!==JSON.stringify(model.answer))throw Error('Solución incoherente '+topic);if(arithmetic.some(op=>!model.steps.some(s=>s.op===op)))throw Error('Operación perdida '+topic);if(p.statement.includes('aportaciones'))throw Error('Vocabulario difícil');count++;}
   }
   const c={grade:'E2',difficulty:'medium',operations:['decimal','fraction','percent','add','subtract','multiply','divide'],quantity:5,theme:'varied',allowCarries:true,seed:'combo'};const batch=generate(c);
   if(batch.length!==5||batch.some(p=>p.contents.length!==3||p.exactAnswer.d>100||100%p.exactAnswer.d))throw Error('Dinero no exacto');
   const languages={};for(const lang of ['en','fr','ar']){const translated=ProblemLanguages.version(batch[0],lang);if(translated.statement.includes('¿')||translated.statement.includes('aportaciones'))throw Error('Traducción incompleta');languages[lang]=translated.statement.length;}
   let rejected=false;try{generate({...c,operations:['geometry','equation']})}catch{rejected=true}if(!rejected)throw Error('Combinación incompatible ignorada');
   const own={id:'import-test',type:'worksheet',title:'Prueba de importación',problems:[batch[0]],grade:'E2'};const copy={schema:'problemia-backup',version:2,data:{materials:[own],strokeStore:{}}};const data=Materials.validateBackup(copy);if(Materials.mergeBackup(data)!==1||Materials.mergeBackup(data)!==0)throw Error('Duplicación al importar');
   let invalid=false;try{Materials.validateBackup({data:{materials:[{id:'bad',title:'Error',problems:[{}]}]}})}catch{invalid=true}if(!invalid)throw Error('Importación inválida aceptada');
   return{count,languages,combo:batch.length};
 });
 await page.locator('#settingsButton').click();await page.locator('#readingFont').selectOption('school');await page.locator('#closeSettings').click();
 await page.evaluate(()=>{state.problems=generate({grade:'P3',difficulty:'medium',operations:['add','subtract'],quantity:2,theme:'varied',allowCarries:true,seed:'pdf'});state.data.lastConfig={grade:'P3'};renderResults()});
 const downloadPromise=page.waitForEvent('download');await page.locator('#downloadWorksheet').click();const download=await downloadPromise;const target=path.join(require('node:os').tmpdir(),'problemia-school.pdf');await download.saveAs(target);console.log('PDF de muestra:',target);
 await page.locator('[data-edit]').first().click();await page.locator('#editStatement').fill('Nora tiene 4 libros y recibe 3. ¿Cuántos tiene ahora?');await page.locator('#editAnswer').fill('7 libros');await page.locator('#manualReviewed').check();await page.locator('#editForm button[type="submit"]').click();assert(await page.locator('.problem-statement').first().textContent().then(s=>s.includes('Nora')));
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);await context.setOffline(true);await page.reload();assert.equal(await page.locator('#settingsButton').count(),1);assert(await page.locator('body').evaluate(e=>e.classList.contains('font-school')));await page.locator('[data-view="generator"]').first().click();await page.locator('#grade').selectOption('P1');await page.locator('#generatorForm button[type="submit"]').click();assert(await page.locator('.problem-card').count()>0);assert.deepEqual(errors,[]);console.log(JSON.stringify({...report,offline:true,import:true,editor:true},null,2));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exit(1)});
