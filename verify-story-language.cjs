const assert=require('node:assert/strict'),path=require('node:path');
let pw;try{pw=require('playwright')}catch{pw=require('C:/Users/Paco/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright')}
(async()=>{const browser=await pw.chromium.launch({headless:true}),page=await browser.newPage();try{
 await page.goto('file:///'+path.join(process.cwd(),'index.html').replaceAll('\\','/'));
 const report=await page.evaluate(()=>{
  const ctx=id=>StoryBank.situations.find(x=>x.id===id);
  const fixtures=[
   {context:'tennis',n:3,a:17,extra:'',removed:false,answer:51,question:'¿Cuántas pelotas hay en total?'},
   {context:'camp',n:4,a:35,extra:StoryLanguage.receive(ctx('camp'),9,1),removed:false,answer:149,question:'¿Cuántas barritas hay en total?'},
   {context:'swim',n:3,a:21,extra:StoryLanguage.take(ctx('swim'),1,0),removed:true,answer:62,question:'¿Cuántos gorros quedan?'}
  ];
  const examples=fixtures.map(f=>{const c=ctx(f.context),question=StoryLanguage.question(c,{removed:f.removed});if(question!==f.question)throw Error('Pregunta incorrecta: '+question);const text=[StoryLanguage.shipment(c,f.n,f.a),f.extra,question].filter(Boolean).join(' ');if(/recipiente|usar ahora|botes/.test(text))throw Error('Regresión en el ejemplo: '+text);return {statement:text,answer:f.answer}});
  let count=0;const structures=new Set(),contexts=new Set();
  for(const difficulty of ['easy','medium','hard','challenge'])for(let mask=1;mask<16;mask++){
   const ops=['add','subtract','multiply','divide'].filter((op,i)=>mask&(1<<i));
   for(let i=0;i<StoryBank.situations.length*StoryBank.forms.length;i++){
    const c={grade:'P5',difficulty,operations:ops,quantity:1,allowCarries:true,divisionMode:'mixed',theme:'varied',seed:'language'};
    const p=StoryBank.build(c,'language-'+difficulty+'-'+mask+'-'+i,i);if(!p)continue;
    const model=p.mathematicalModel,removed=model.steps.some(s=>s.op==='subtract');
    if(/cada recipiente|por recipiente|quedan para usar ahora/.test(p.statement))throw Error('Vocabulario genérico: '+p.statement);
    if(!removed&&/\bquedan?\b/.test(p.statement))throw Error('Se pregunta por un resto sin haber retirado nada: '+p.statement);
    if(StoryBank.solve(model.tree,[])!==model.answer)throw Error('Cambio en el resultado');
    if(p.contextId==='tennis'&&/botes/.test(p.statement))throw Error('Envase de tenis no revisado');
    count++;structures.add(p.structure);contexts.add(p.contextId);
   }
  }
  if(structures.size!==9||contexts.size!==20)throw Error('Faltan estructuras o contextos en la revisión');
  return {count,structures:structures.size,contexts:contexts.size,examples};
 });assert(report.count>0);console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
