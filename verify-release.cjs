const assert=require('node:assert/strict'),path=require('node:path');
let playwright;try{playwright=require('playwright')}catch{playwright=require('C:/Users/Paco/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright')}
(async()=>{
 const browser=await playwright.chromium.launch({headless:true}),page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('file:///'+path.join(process.cwd(),'index.html').replaceAll('\\','/'));
  const report=await page.evaluate(()=>{
   const grades=['P1','P2','P3','P4','P5','P6','E1','E2'],difficulties=['easy','medium','hard','challenge'];let count=0;const logicForms=new Set();
   const independent=t=>{if(t.kind==='value')return t.value.n/t.value.d;const a=independent(t.left),b=independent(t.right);return t.op==='add'?a+b:t.op==='subtract'?a-b:t.op==='multiply'?a*b:a/b;};
   for(const grade of grades)for(const difficulty of difficulties){
    const c={grade,difficulty,quantity:10,operations:['logic'],type:'context',theme:'varied',allowCarries:true,divisionMode:'mixed',seed:grade+difficulty};
    const batch=generate(c);if(batch.length!==10)throw Error('Lógica incompleta');
    for(const p of batch){logicForms.add(p.template);const m=p.mathematicalModel;const value=AdvancedBank.solve(m.tree,[]);if(value.n!==m.answer.n||value.d!==m.answer.d)throw Error('Lógica incorrecta');if(m.steps.some(s=>Math.abs(s.result.n/s.result.d)>getLearningProfile(c).max))throw Error('Lógica fuera de nivel');count++;}
    const topics=getLearningProfile(c).recommended.filter(x=>!['add','subtract','multiply','divide'].includes(x));
    for(const topic of topics)for(const arithmetic of [[],['add','subtract','multiply','divide']]){
     const config={...c,quantity:20,operations:[topic,...arithmetic],seed:grade+difficulty+topic+arithmetic.join()};
     let problems;try{problems=generate(config)}catch(error){throw Error(config.seed+': '+error.message)}if(problems.length!==20)throw Error('Lote avanzado incompleto '+config.seed);
     if(problems.some(p=>Math.abs(independent(p.mathematicalModel.tree)-p.exactAnswer.n/p.exactAnswer.d)>1e-8))throw Error('Comprobación matemática independiente fallida');
     for(const p of problems){const semantic=p.mathematicalModel.semantic;if(semantic?.kind==='root'){const check=t=>{if(t.kind==='value'){if(t.label==='root'&&Math.abs((t.value.n/t.value.d)**semantic.degree-semantic.values[0])>1e-8)throw Error('Raíz incorrecta');}else{check(t.left);check(t.right)}};check(p.mathematicalModel.tree);}}
     for(const p of problems){const m=p.mathematicalModel,result=AdvancedBank.solve(m.tree,[]);if(result.n!==m.answer.n||result.d!==m.answer.d)throw Error('Resultado avanzado incorrecto');if(arithmetic.some(op=>!m.steps.some(s=>s.op===op)))throw Error('Operación ausente');if(!ProblemRepresentation.expression(p))throw Error('Sin representación');if(!/^[A-ZÁÉÍÓÚÜÑ¿0-9]/.test(p.statement))throw Error('Inicio de texto incorrecto');count++;}
    }
   }
   // Cada propuesta de un reto racional debe existir y ser distinta del resultado.
   const batch=generate({grade:'E2',difficulty:'medium',type:'challenge',operations:['fraction'],quantity:4,allowCarries:true,theme:'varied',seed:'rational-reasoning'});
   if(!batch[0].statement.includes('propone')||!batch[1].statement.includes('dos resultados'))throw Error('Razonamiento racional no funcional');
   if(batch.some(p=>/NaN|undefined|\[object Object\]/.test(p.statement+p.steps.join(' '))))throw Error('Texto inválido');
   return {count,logicForms:[...logicForms],rationalReasoning:true};
  });
  await page.evaluate(()=>{state.problems=generate({grade:'E2',difficulty:'hard',operations:['geometry','add','subtract','multiply','divide'],quantity:5,allowCarries:true,theme:'varied',seed:'ui-final'});state.data.lastConfig={grade:'E2'};renderResults()});
  await page.locator('[data-solution]').first().click();assert(await page.locator('.combined-expression').first().isVisible());
  await page.locator('#openBoard').click();await page.locator('#showHint').click();assert((await page.locator('#hintPanel').textContent()).includes('Representación'));
  await page.locator('#exitBoard').click();await page.goBack();assert(await page.locator('#boardView').evaluate(e=>e.classList.contains('active')));await page.goForward();assert(await page.locator('#resultsView').evaluate(e=>e.classList.contains('active')));
  const longDownload=page.waitForEvent('download');await page.evaluate(()=>{state.data.reading.font='school';state.problems=[{id:'long',statement:('Este es un enunciado largo para comprobar la impresión. ').repeat(33),answer:'1',unit:'',steps:['1 + 0 = 1']}];makePDF(true)});await (await longDownload).saveAs(path.join(require('node:os').tmpdir(),'problemia-long.pdf'));
  await page.setViewportSize({width:390,height:844});await page.locator('#mobileMenuButton').click();assert(await page.locator('.sidebar').evaluate(e=>e.classList.contains('menu-open')));
  assert.deepEqual(errors,[]);console.log(JSON.stringify({...report,history:true,combinedExpression:true,longPDF:true,mobile:true},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
