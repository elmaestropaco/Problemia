const assert=require('node:assert/strict'),path=require('node:path');
let pw;try{pw=require('playwright')}catch{pw=require('C:/Users/Paco/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright')}
(async()=>{const browser=await pw.chromium.launch({headless:true}),page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));try{
 await page.goto('file:///'+path.join(process.cwd(),'index.html').replaceAll('\\','/'));
 const report=await page.evaluate(()=>{
  const arithmetic=['add','subtract','multiply','divide'],topics=['decimal','fraction','percent','measure','geometry','proportion','divisibility','power','root','equation','logic'];let mandatory=0,mixed=0;
  const defaults={theme:'varied',allowCarries:true,divisionMode:'mixed',type:'context'};
  function check(p,required){const actual=GenerationPlanner.evidence(p);if(required.some(op=>!actual.has(op)))throw Error('Falta una opción en el modelo: '+required.join(','));if(p.verifiedOperations.length!==required.length)throw Error('Validación incompleta');if(required.includes('fraction')&&!/\d+\/\d+/.test(p.statement))throw Error('Fracción sin representar');if(required.includes('percent')&&!p.statement.includes('%'))throw Error('Porcentaje sin representar');}
  for(const grade of ['P1','P2','P3','P4','P5','P6','E1','E2'])for(const difficulty of ['easy','medium','hard','challenge']){
   const c={...defaults,grade,difficulty,operations:arithmetic,operationMode:'all',quantity:5,seed:'four-'+grade+difficulty};for(const p of generate(c)){check(p,arithmetic);mandatory++;}
  }
  for(const grade of ['E1','E2'])for(const difficulty of ['easy','medium','hard','challenge'])for(const topic of topics){
   const operations=[...arithmetic,topic],c={...defaults,grade,difficulty,operations,operationMode:'all',quantity:5,seed:'five-'+grade+difficulty+topic};let batch;try{batch=generate(c)}catch(e){throw Error(c.seed+': '+e.message)}if(batch.length!==5)throw Error('Lote obligatorio incompleto');for(const p of batch){check(p,operations);mandatory++;}
  }
  for(const operations of [['decimal','fraction','percent','add'],['decimal','fraction','percent','add','subtract'],['geometry','fraction','percent','add','subtract']])for(const grade of ['P6','E1','E2'])for(const difficulty of ['easy','medium','hard','challenge']){
   const c={...defaults,grade,difficulty,operations,operationMode:'all',quantity:5,seed:grade+difficulty+operations.join('-')};let batch;try{batch=generate(c)}catch(e){throw Error(c.seed+': '+e.message)}for(const p of batch){check(p,operations);mandatory++;}
  }
  for(const operations of [arithmetic,[...arithmetic,'fraction'],[...arithmetic,'decimal']])for(const grade of ['P4','P6','E2'])for(const difficulty of ['easy','medium','hard','challenge'])for(const balanced of [true,false])for(const quantity of [5,10,20]){
   const c={...defaults,grade,difficulty,operations,operationMode:'mixed',balanced,quantity,seed:`mix-${grade}-${difficulty}-${balanced}-${quantity}-${operations.join()}`},batch=generate(c),covered=new Set();if(batch.length!==quantity)throw Error('Lote mezclado incompleto');for(const p of batch){check(p,p.selectionOperations);p.verifiedOperations.forEach(op=>covered.add(op));mixed++;}if(operations.some(op=>!covered.has(op)))throw Error('No aparecen todas las opciones de la ficha: '+c.seed);
  }
  const five=[...arithmetic,'fraction'],batch=generate({...defaults,grade:'E2',difficulty:'hard',operations:five,operationMode:'mixed',quantity:10,seed:'five-in-one'});if(!batch.some(p=>p.verifiedOperations.length===5))throw Error('No se llega a combinar cinco opciones');
  const original=generate({...defaults,grade:'E2',difficulty:'medium',operations:five,operationMode:'all',quantity:1,seed:'evidence'})[0],tampered=structuredClone(original);
  function remove(node){if(!node)return;node.contents=(node.contents||[]).filter(option=>option!=='fraction');remove(node.left);remove(node.right)}remove(tampered.mathematicalModel.tree);let rejected=false;try{GenerationPlanner.verify(tampered,five)}catch{rejected=true}if(!rejected)throw Error('Se aceptan etiquetas sin evidencia en el modelo');
  let incompatible=false;try{generate({...defaults,grade:'E2',difficulty:'hard',operations:['geometry','measure','equation','power','add'],operationMode:'all',quantity:1,seed:'incompatible'})}catch{incompatible=true}if(!incompatible)throw Error('Se ignoran temas incompatibles');
  return {mandatory,mixed,fiveInOne:true,coverageWithoutBalanced:true,rejectMissingEvidence:true,incompatibleIsExplicit:true};
 });
 await page.locator('[data-view="generator"]').first().click();await page.locator('#grade').selectOption('E2');await page.locator('#difficulty').selectOption('hard');await page.locator('#advancedToggle').click();await page.locator('#allowCarries').locator('..').click();const chosen=['add','subtract','multiply','divide','fraction'];for(const value of chosen)await page.locator(`#operations input[value="${value}"]`).check();
 await page.locator('#operationMode').selectOption('all');await page.locator('#generatorForm button[type="submit"]').click();assert.equal(await page.locator('.problem-card').count(),10);assert(await page.evaluate(()=>state.problems.every(p=>p.verifiedOperations.length===5)));
 await page.locator('[data-view="generator"]').first().click();await page.locator('#operationMode').selectOption('mixed');await page.locator('#generatorForm button[type="submit"]').click();assert(await page.evaluate(()=>new Set(state.problems.flatMap(p=>p.verifiedOperations)).size===5));assert.deepEqual(errors,[]);console.log(JSON.stringify({...report,uiBothModes:true},null,2));
 }finally{await browser.close()}})().catch(error=>{console.error(error);process.exit(1)});
