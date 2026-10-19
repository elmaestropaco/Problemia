const assert=require('node:assert/strict'),path=require('node:path');
let pw;try{pw=require('playwright')}catch{pw=require('C:/Users/Paco/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright')}
(async()=>{const browser=await pw.chromium.launch({headless:true}),page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));try{
 await page.goto('file:///'+path.join(process.cwd(),'index.html').replaceAll('\\','/'));
 const report=await page.evaluate(()=>{
  let count=0;const examples=[];
  const museum=StoryBank.situations.find(x=>x.id==='museum');if(ProblemText.grammar(StoryLanguage.take(museum,1,0))!=='Los visitantes se llevan 1 folleto.')throw Error('Concordancia del sujeto incorrecta');
  for(const ctx of StoryBank.situations)for(let variant=0;variant<3;variant++){const text=StoryLanguage.take(ctx,1,variant);if(/se (comen|usan|abren|plantan|prestan|venden|guardan) 1\b/.test(text))throw Error('Objeto singular con verbo incorrecto: '+text);}
  for(const grade of ['P1','P2','P3','P4','P5','P6','E1','E2'])for(const difficulty of ['easy','medium','hard','challenge']){
   const pool=['add','subtract','multiply','divide'];const c={grade,difficulty,operations:pool,operationMode:'mixed',quantity:12,allowCarries:true,divisionMode:'mixed',theme:'varied',seed:grade+difficulty};
   const batch=generate(c);if(batch.length!==12)throw Error('Ficha mezclada incompleta');const covered=new Set();
   for(const p of batch){if(!p.selectionOperations?.length||p.selectionOperations.some(op=>!pool.includes(op)))throw Error('Selección incorrecta');p.selectionOperations.forEach(op=>covered.add(op));if(p.selectionOperations.some(op=>!p.mathematicalModel.steps.some(s=>s.op===op)))throw Error('Falta una operación elegida');if(p.operations.some(op=>!p.selectionOperations.includes(op)))throw Error('Operación aritmética añadida');count++;}
   if(covered.size!==4)throw Error('No se reparten todas las operaciones');if(!batch.some(p=>p.selectionOperations.length===1)||!batch.some(p=>p.selectionOperations.length>1))throw Error('No hay variedad de combinaciones');
  }
  const pool=['add','subtract','multiply','divide','decimal','fraction','percent','measure','geometry','proportion','divisibility','power','root','equation','logic'];
  for(const difficulty of ['easy','medium','hard','challenge']){
   const c={grade:'E2',difficulty,operations:pool,operationMode:'mixed',quantity:20,allowCarries:true,divisionMode:'mixed',theme:'varied',seed:'all-topics-'+difficulty};
   const batch=generate(c),covered=new Set();for(const p of batch){p.selectionOperations.forEach(op=>covered.add(op));if(p.selectionOperations.filter(x=>GenerationPlanner.principals.has(x)).length>1)throw Error('Mezcla de temas incompatibles');if(/cantidades iguales a la que queda|cantidad final, expresada|cantidad calculada|las cantidad\b|de el |¿Cuántos fichas|\bundefined\b|NaN/.test(p.statement))throw Error('Redacción artificial o incorrecta: '+p.statement);count++;}if(covered.size!==pool.length)throw Error('Temas sin representación');
   if(difficulty==='medium')examples.push(...batch.slice(0,5).map(p=>({selection:p.selectionOperations,text:p.statement})));
  }
  const lone=generate({grade:'P2',difficulty:'easy',operations:['add','subtract'],operationMode:'mixed',quantity:1,allowCarries:true,theme:'varied',seed:'single'});if(lone.length!==1)throw Error('Falla cantidad uno');
  const points=generate({grade:'P3',difficulty:'medium',operations:['logic','subtract'],quantity:1,allowCarries:true,theme:'varied',seed:'score'});if(/duración|dura|tiempo|plan se acorta/.test(points[0].statement))throw Error('Se confunden puntos y tiempo');
  const equation=generate({grade:'E1',difficulty:'medium',operations:['equation'],quantity:1,allowCarries:true,theme:'varied',seed:'notebook'});if(!equation[0].statement.endsWith('¿Cuánto cuesta un cuaderno?'))throw Error('Pregunta de la incógnita ambigua');
  const all=generate({grade:'P3',difficulty:'medium',operations:['add','subtract','multiply'],operationMode:'all',quantity:5,allowCarries:true,theme:'varied',seed:'all'});if(all.some(p=>p.operations.length!==3))throw Error('Se rompe el modo obligatorio');
  const reasoning=generate({grade:'E2',difficulty:'medium',type:'challenge',operations:['add','subtract'],operationMode:'mixed',quantity:8,allowCarries:true,theme:'varied',seed:'mixed-reasoning'});if(new Set(reasoning.map(p=>p.reasoning.mode)).size!==4)throw Error('Se repite la consigna en modo mezclado');
  return {count,coverage:true,mixedAndSingle:true,reasoning:true,examples};
 });
 await page.locator('[data-view="generator"]').first().click();await page.locator('#operationMode').selectOption('mixed');await page.reload();assert.equal(await page.locator('#operationMode').inputValue(),'mixed');await page.locator('[data-view="generator"]').first().click();await page.locator('#generatorForm button[type="submit"]').click();assert.equal(await page.locator('.problem-card').count(),10);assert(await page.evaluate(()=>state.problems.every(p=>p.generationMode==='mixed')));assert.deepEqual(errors,[]);console.log(JSON.stringify({...report,persistence:true,ui:true},null,2));
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
