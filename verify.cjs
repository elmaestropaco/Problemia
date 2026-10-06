const assert=require('node:assert/strict');
let playwright;try{playwright=require('playwright')}catch{playwright=require('C:/Users/Paco/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright')}
const {chromium}=playwright;
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
 if(process.argv.includes('--screenshot')){const file=path.join(require('node:os').tmpdir(),'problemia-home.png');await page.screenshot({path:file,fullPage:true});console.log('Vista:',file);}
 const report=await page.evaluate(()=>{
   let count=0;
   for(const grade of ['P1','P2','P3','P4','P5','P6','E1','E2'])for(const difficulty of ['easy','medium','hard','challenge'])for(const ops of [['add','subtract'],['multiply','divide'],['add','subtract','multiply'],['add','subtract','multiply','divide']]){
     const c={grade,difficulty,operations:ops,quantity:5,theme:'varied',allowCarries:true,allowNegative:false,divisionMode:'exact',seed:'validation'};
     const batch=generate(c);if(batch.length!==5)throw Error('Lote incompleto: '+grade+' '+difficulty);
     for(const p of batch){let value=p.mathematicalModel.initial;const covered=new Set();for(const step of p.mathematicalModel.steps){if(!p.mathematicalModel.tree&&value!==step.left)throw Error('Paso desconectado');const expected=ProblemEngine.calculate(step.left,step.op,step.right);if(expected!==step.result)throw Error('Cálculo incorrecto');if(Math.max(Math.abs(step.left),Math.abs(step.right),Math.abs(step.result))>getLearningProfile(c).max)throw Error('Fuera del rango del curso');if(step.op==='divide'&&step.remainder!==0)throw Error('División inexacta');value=expected;covered.add(step.op)}if(ops.some(op=>!covered.has(op)))throw Error('Falta operación');if(value!==p.mathematicalModel.answer)throw Error('Respuesta incorrecta');if(p.mathematicalModel.tree&&StoryBank.solve(p.mathematicalModel.tree,[])!==value)throw Error('Árbol incoherente');if(!p.statement.endsWith('?')&&!p.reasoning)throw Error('Falta pregunta');if(difficulty==='challenge'&&!p.reasoning)throw Error('Reto sin razonamiento');count++}
   }
   for(let i=0;i<30;i++){const c={grade:'E1',difficulty:'medium',operations:['add','subtract'],quantity:5,theme:'varied',allowCarries:false,seed:'carry-'+i};for(const p of generate(c))for(const s of p.mathematicalModel.steps){if(ProblemEngine.hasCarry(s.left,s.right,s.op==='subtract'))throw Error('Llevada no permitida')}}
   state.data.generationHistory={texts:[],structures:[]};
   const diversity=[],models=new Set(),contexts=new Set();
   for(let session=0;session<5;session++)for(const p of generate({grade:'E1',difficulty:'medium',operations:['add','subtract','multiply'],quantity:20,theme:'varied',allowCarries:true,divisionMode:'mixed',seed:'diversity-'+session})){diversity.push(StoryBank.fingerprint(p.statement));models.add(p.structure);contexts.add(p.contextId);}
   const unique=new Set(diversity).size;if(unique<95)throw Error('Diversidad insuficiente: '+unique+'/100');if(models.size<5)throw Error('Pocas estructuras: '+[...models].join(', '));
   const challenge=generate({grade:'P3',difficulty:'medium',type:'challenge',operations:['add','subtract'],quantity:4,theme:'varied',allowCarries:true,seed:'reasoning'});if(challenge.some(p=>!p.reasoning))throw Error('Tipo razonamiento ignorado');if(challenge.some(p=>p.reasoning.proposedAnswer!==null&&p.reasoning.proposedAnswer===p.mathematicalModel.answer))throw Error('Propuesta errónea coincide con solución');
   return {count,reasoning:challenge.map(p=>p.reasoning.mode),diversity:{total:diversity.length,uniqueWithoutNumbers:unique,models:models.size,contexts:contexts.size},sample:generate({grade:'E1',difficulty:'medium',operations:['add','subtract'],quantity:1,theme:'varied',allowCarries:true,seed:'sample'})[0].statement};
 });
 assert.equal(await page.locator('.topbar').evaluate(e=>getComputedStyle(e).display),'none');assert.equal(await page.locator('.sidebar #saveStatus').count(),1);assert.equal(await page.locator('.hero-copy').textContent().then(t=>t.includes('BUENOS DÍAS')),false);
 await page.locator('#settingsButton').click();await page.locator('#readingFont').selectOption('school');await page.locator('#readingSize').selectOption('large');await page.locator('#closeSettings').click();await page.reload();assert(await page.locator('body').evaluate(e=>e.classList.contains('font-school')&&e.classList.contains('reading-large')));
 await page.locator('[data-view="generator"]').first().click();await page.locator('#grade').selectOption('E1');await page.locator('#difficulty').selectOption('hard');await page.locator('#operations input[value="multiply"]').check();await page.reload();assert.equal(await page.locator('#grade').inputValue(),'E1');assert.equal(await page.locator('#difficulty').inputValue(),'hard');assert(await page.locator('#operations input[value="multiply"]').isChecked());
 await page.locator('[data-view="generator"]').first().click();await page.locator('#generatorForm button[type="submit"]').click();assert.equal(await page.locator('.problem-card').count(),10);
 for(const id of ['downloadWorksheet','downloadAnswers']){const downloadPromise=page.waitForEvent('download',{timeout:15000});await page.locator('#'+id).click();const download=await downloadPromise;assert.equal(await download.failure(),null);console.log('PDF descargado:',download.suggestedFilename());}
 const layout=await page.evaluate(()=>{
   const Constructor=window.jspdf.jsPDF;let checked=0,lines=0;const fonts=new Set();
   window.jspdf.jsPDF=function(options){const doc=new Constructor(options);let rectangle=null;const rect=doc.roundedRect.bind(doc),text=doc.text.bind(doc),line=doc.line.bind(doc);doc.roundedRect=function(x,y,w,h,rx,ry,style){if(x===14&&w===182&&y>29)rectangle={x,y,w,h};return rect(x,y,w,h,rx,ry,style)};doc.text=function(content,x,y,...rest){if(doc.getFontSize()===12&&rectangle){fonts.add(doc.getFont().fontName);const rows=Array.isArray(content)?content:[content];if(rows.some(row=>doc.getTextWidth(row)>170.1))throw Error('Texto demasiado ancho');const last=y+(rows.length-1)*doc.getLineHeight()/doc.internal.scaleFactor;if(last>rectangle.y+rectangle.h)throw Error('Texto fuera de la tarjeta');checked++;}return text(content,x,y,...rest)};doc.line=function(...args){lines++;return line(...args)};doc.save=()=>doc;return doc};
   makePDF(false);makePDF(true);window.jspdf.jsPDF=Constructor;if(lines)throw Error('Los cuadros contienen rayas');if(!fonts.has('Borel'))throw Error('Falta letra ligada en PDF');return {checked,lines,fonts:[...fonts]};
 });
 assert.deepEqual(errors,[]);console.log(JSON.stringify({report,layout},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
