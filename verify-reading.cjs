const assert=require('node:assert/strict'),path=require('node:path');
let playwright;try{playwright=require('playwright')}catch{playwright=require('C:/Users/Paco/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright')}
(async()=>{
 const browser=await playwright.chromium.launch({headless:true}),page=await browser.newPage();try{
 await page.goto('file:///'+path.join(process.cwd(),'index.html').replaceAll('\\','/'));
 const report=await page.evaluate(()=>{
  let count=0,maxBasic=0,maxCombined=0;const samples=[];
  for(const grade of ['P1','P2'])for(const difficulty of ['easy','medium','hard','challenge'])for(const textLength of ['short','standard','long'])for(let mask=1;mask<16;mask++){
   const operations=['add','subtract','multiply','divide'].filter((op,i)=>mask&(1<<i));
   const c={grade,difficulty,textLength,operations,quantity:5,type:'context',theme:'varied',allowCarries:true,divisionMode:'mixed',seed:`reading-${grade}-${difficulty}-${textLength}-${mask}`};
   const batch=generate(c);if(batch.length!==5)throw Error('Ficha breve incompleta: '+c.seed);
   for(const p of batch){const model=p.mathematicalModel,words=p.statement.split(/\s+/).length;
    if(!p.template.startsWith('early:'))throw Error('Se ha usado un modelo de lectura largo');
    if(operations.some(op=>!model.steps.some(s=>s.op===op)))throw Error('Se pierde una operación');
    let total=model.initial;for(const s of model.steps){if(s.left!==total)throw Error('Modelo discontinuo');total=s.op==='add'?total+s.right:s.op==='subtract'?total-s.right:s.op==='multiply'?total*s.right:Math.floor(total/s.right)}if(total!==model.answer)throw Error('Solución incorrecta');
    if(operations.length<=2){maxBasic=Math.max(maxBasic,words);if(words>50)throw Error('Problema básico demasiado largo: '+p.statement)}else{maxCombined=Math.max(maxCombined,words);if(words>80)throw Error('Problema combinado demasiado largo');}
    if(/almacén|existencias|proveedor|aportaciones|se apartan 1|las cantidad/i.test(p.statement))throw Error('Vocabulario o concordancia inadecuados');count++;
   }
   if(grade==='P1'&&difficulty==='medium'&&textLength==='standard'&&mask===3)samples.push(...batch.slice(0,2).map(p=>p.statement));
  }
  const corrected=ProblemText.simple(ProblemText.grammar('Antes de guardar el pedido, se apartan 1 lata de comida. El resto se suma a las existencias anteriores.'));
  if(corrected!=='Antes de guardar el pedido, se aparta 1 lata de comida. El resto se suma a lo que ya había.')throw Error('Regresión de concordancia: '+corrected);
  return {count,maxBasic,maxCombined,samples,grammar:true};
 });assert(report.count>0);console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
