/* Primer ciclo: una acción por frase, objetos conocidos y sin detalles accesorios. */
(() => {
  const contexts=[
    {theme:'classroom',name:'Ana',unit:'lápices',single:'lápiz',give:'recibe',take:'regala'},
    {theme:'classroom',name:'Leo',unit:'libros',single:'libro',give:'recibe',take:'presta'},
    {theme:'classroom',name:'Nora',unit:'pegatinas',single:'pegatina',give:'consigue',take:'regala'},
    {theme:'nature',name:'Álex',unit:'semillas',single:'semilla',give:'recoge',take:'planta'},
    {theme:'nature',name:'Luna',unit:'manzanas',single:'manzana',give:'recoge',take:'regala'},
    {theme:'sport',name:'Pablo',unit:'pelotas',single:'pelota',give:'recibe',take:'presta'},
    {theme:'shopping',name:'Aina',unit:'galletas',single:'galleta',give:'compra',take:'come'},
    {theme:'travel',name:'Hugo',unit:'bocadillos',single:'bocadillo',give:'recibe',take:'reparte'}
  ];
  function build(c,seed,index){
    const selected=['add','subtract','multiply','divide'].filter(op=>c.operations.includes(op));
    if(!selected.length||c.operations.length!==selected.length||c.allowNegative)return null;
    const rng=seeded(seed),pick=(a,b)=>rand(rng,a,b),profile=getLearningProfile(c);
    const pool=contexts.filter(ctx=>!c.theme||c.theme==='varied'||ctx.theme===c.theme),ctx=pool[index%pool.length];if(!ctx)return null;
    const quantity=n=>`${n} ${n===1?ctx.single:ctx.unit}`;
    const initial=pick(2,Math.max(3,Math.floor(profile.max/(selected.includes('multiply')?5:2))));
    let current=initial,grouped=false;const steps=[],sentences=[];
    const order=selected.includes('multiply')?['multiply',...selected.filter(op=>op!=='multiply')]:[...selected];
    const extras=selected.filter(op=>['add','subtract'].includes(op));
    for(let k=order.length;k<profile.targetSteps&&extras.length;k++)order.splice(order.includes('divide')?order.length-1:order.length,0,extras[k%extras.length]);
    if(order[0]!=='multiply')sentences.push(`${ctx.name} tiene ${quantity(initial)}.`);
    for(const op of order){
      let amount=op==='multiply'||op==='divide'?pick(2,Math.min(5,profile.factor)):pick(1,Math.max(2,Math.floor(profile.max/4)));
      if(op==='subtract')amount=Math.min(amount,current-1);if(amount<1)return null;
      const result=ProblemEngine.calculate(current,op,amount),remainder=op==='divide'?current%amount:0;
      if(result<0||result>profile.max||!c.allowCarries&&['add','subtract'].includes(op)&&ProblemEngine.hasCarry(current,amount,op==='subtract'))return null;
      if(op==='divide'&&(c.divisionMode==='exact'&&remainder!==0||c.divisionMode==='inexact'&&remainder===0))return null;
      steps.push({op,left:current,right:amount,result,remainder});
      if(op==='multiply')sentences.push(`${ctx.name} tiene ${amount} bolsas con ${quantity(current)} en cada una.`);
      else if(op==='add')sentences.push(cleanSpanish(`${ctx.give} ${quantity(amount)} más.`));
      else if(op==='subtract')sentences.push(cleanSpanish(`${ctx.take} ${quantity(amount)}.`));
      else{sentences.push(`Hace bolsas de ${quantity(amount)} con lo que queda.`);grouped=true;}
      current=result;
    }
    const remainder=steps.at(-1).remainder;
    const question=grouped?`¿Cuántas bolsas completas hace?${remainder?' ¿Cuántos '+ctx.unit+' sobran?':''}`:order.includes('subtract')?`¿Cuántos ${ctx.unit} le quedan?`:`¿Cuántos ${ctx.unit} tiene en total?`;
    // La pregunta conserva el género de los objetos.
    const feminine=['pegatinas','semillas','manzanas','pelotas','galletas'];
    let statement=[...sentences,c.textLength==='long'?'Son para una actividad.':'',question].filter(Boolean).join(' ');
    if(feminine.includes(ctx.unit))statement=statement.replace(/¿Cuántos /g,'¿Cuántas ');
    return {id:uid(),template:`early:${ctx.unit}:${order.join('-')}`,structure:'early-linear',contextId:ctx.unit,topic:`Problema de ${steps.length} pasos`,grade:c.grade,theme:ctx.theme,statement,answer:remainder?`${current} bolsas; sobran ${quantity(remainder)}`:current,unit:remainder?'':grouped?'bolsas':ctx.unit,steps:steps.map(s=>`${s.left} ${{add:'+',subtract:'−',multiply:'×',divide:'÷'}[s.op]} ${s.right} = ${s.result}${s.remainder?`, resto ${s.remainder}`:''}`),operations:selected,hint:'Puedes dibujar los objetos y tachar los que se van.',mathematicalModel:{initial,steps,answer:current},createdAt:new Date().toISOString(),favorite:false};
  }
  window.EarlyReadingBank={build,contexts};
})();
