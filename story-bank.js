/* Banco de situaciones y árboles de cálculo. Los contextos no se cuentan
   como estructuras matemáticas: cada estructura identifica sus dependencias. */
(() => {
  const ops=['add','subtract','multiply','divide'];
  const situations=[
    {id:'museum',theme:'travel',unit:'folletos',place:'el museo',actor:'El museo',pack:'cajas',destination:'para las visitas escolares',receive:'La imprenta entrega',remove:'Se reservan',group:'carpetas',goal:'¿Cuántos folletos quedan disponibles?'},
    {id:'camp',theme:'travel',unit:'barritas de cereales',place:'el campamento',actor:'La organización del campamento',pack:'cajas',destination:'para las rutas del fin de semana',receive:'El supermercado entrega',remove:'Se consumen',group:'bolsas de comida',goal:'¿Cuántas barritas quedan para las rutas?'},
    {id:'hostel',theme:'travel',unit:'toallas',place:'el albergue',actor:'El albergue',pack:'paquetes',destination:'para las habitaciones',receive:'La lavandería devuelve',remove:'Se apartan',group:'lotes',goal:'¿Cuántas toallas hay disponibles?'},
    {id:'station',theme:'travel',unit:'mapas',place:'la oficina de turismo',actor:'La oficina de turismo',pack:'paquetes',destination:'para las personas visitantes',receive:'La imprenta trae',remove:'Se entregan',group:'lotes',goal:'¿Cuántos mapas quedan en la oficina?'},
    {id:'science',theme:'classroom',unit:'tubos de ensayo',place:'el laboratorio del instituto',actor:'El laboratorio',pack:'cajas',destination:'para las prácticas de ciencias',receive:'El proveedor entrega',remove:'Se apartan',group:'equipos de trabajo',goal:'¿Cuántos tubos de ensayo quedan para las prácticas?'},
    {id:'art',theme:'classroom',unit:'pinceles',place:'el taller de plástica',actor:'El taller de plástica',pack:'estuches',destination:'para los talleres del trimestre',receive:'Una asociación dona',remove:'Se reservan',group:'estuches',goal:'¿Cuántos pinceles quedan disponibles?'},
    {id:'music',theme:'classroom',unit:'partituras',place:'la escuela de música',actor:'La escuela de música',pack:'carpetas',destination:'para los ensayos',receive:'La copistería entrega',remove:'Se prestan',group:'carpetas',goal:'¿Cuántas partituras quedan en la escuela?'},
    {id:'robotics',theme:'classroom',unit:'piezas de construcción',place:'el taller de robótica',actor:'El taller de robótica',pack:'cajas',destination:'para construir los prototipos',receive:'El proveedor envía',remove:'Se reservan',group:'kits',goal:'¿Cuántas piezas quedan para los prototipos?'},
    {id:'aquarium',theme:'nature',unit:'porciones de alimento',place:'el acuario',actor:'El acuario',pack:'paquetes',destination:'para alimentar a los peces',receive:'El proveedor entrega',remove:'Se utilizan',group:'recipientes',goal:'¿Cuántas porciones de alimento quedan?'},
    {id:'shelter',theme:'nature',unit:'latas de comida',place:'la protectora de animales',actor:'La protectora',pack:'cajas',destination:'para alimentar a los animales',receive:'Una campaña solidaria recoge',remove:'Se utilizan',group:'lotes',goal:'¿Cuántas latas de comida quedan?'},
    {id:'orchard',theme:'nature',unit:'bulbos',place:'el jardín botánico',actor:'El jardín botánico',pack:'bolsas',destination:'para la plantación de primavera',receive:'Otro jardín dona',remove:'Se plantan',group:'bolsas',goal:'¿Cuántos bulbos quedan sin plantar?'},
    {id:'recycling',theme:'nature',unit:'tapones',place:'el punto de recogida',actor:'El punto de recogida',pack:'bolsas',destination:'para una campaña de reciclaje',receive:'Una escuela entrega',remove:'Se apartan',group:'sacos',goal:'¿Cuántos tapones quedan para la campaña?'},
    {id:'swim',theme:'sport',unit:'gorros de natación',place:'la piscina municipal',actor:'La piscina municipal',pack:'cajas',destination:'para los cursillos',receive:'El proveedor entrega',remove:'Se entregan',group:'lotes',goal:'¿Cuántos gorros quedan para los cursillos?'},
    {id:'athletics',theme:'sport',unit:'dorsales',place:'el club de atletismo',actor:'El club de atletismo',pack:'paquetes',destination:'para la carrera popular',receive:'La imprenta entrega',remove:'Se asignan',group:'sobres',goal:'¿Cuántos dorsales quedan sin asignar?'},
    {id:'tennis',theme:'sport',unit:'pelotas de tenis',place:'la escuela de tenis',actor:'La escuela de tenis',pack:'botes',destination:'para las clases',receive:'Un patrocinador dona',remove:'Se retiran',group:'botes',goal:'¿Cuántas pelotas quedan disponibles?'},
    {id:'stadium',theme:'sport',unit:'pulseras de acceso',place:'el polideportivo',actor:'El polideportivo',pack:'paquetes',destination:'para el torneo escolar',receive:'La organización recibe',remove:'Se entregan',group:'sobres',goal:'¿Cuántas pulseras quedan por entregar?'},
    {id:'bakery',theme:'shopping',unit:'magdalenas',place:'la pastelería',actor:'La pastelería',pack:'bandejas',destination:'para la venta de hoy',receive:'El obrador prepara',remove:'Se venden',group:'cajas de regalo',goal:'¿Cuántas magdalenas quedan por vender?'},
    {id:'hardware',theme:'shopping',unit:'tornillos',place:'la ferretería',actor:'La ferretería',pack:'cajas',destination:'para atender los pedidos',receive:'El proveedor entrega',remove:'Se venden',group:'bolsas',goal:'¿Cuántos tornillos quedan en el almacén?'},
    {id:'market',theme:'shopping',unit:'naranjas',place:'la frutería',actor:'La frutería',pack:'cajas',destination:'para el mercado del sábado',receive:'Otro productor entrega',remove:'Se venden',group:'bolsas',goal:'¿Cuántas naranjas quedan en el puesto?'},
    {id:'printing',theme:'shopping',unit:'tarjetas',place:'la imprenta',actor:'La imprenta',pack:'paquetes',destination:'para una feria',receive:'Otro taller aporta',remove:'Se entregan',group:'sobres',goal:'¿Cuántas tarjetas quedan por entregar?'}
  ];
  const forms=[
    {id:'delivery-stock',description:'Producto de un pedido, existencias adicionales, retirada y agrupación'},
    {id:'per-container',description:'Modificar el contenido de cada recipiente, reunir recipientes y agrupar'},
    {id:'two-reserves',description:'Sumar dos reservas antes de restarlas a las existencias'},
    {id:'two-sources',description:'Calcular dos aportaciones por separado y reunirlas'},
    {id:'remaining-delivery',description:'Retirar material del pedido antes de sumarlo al almacén'},
    {id:'shared-first',description:'Repartir las existencias y modificar después cada parte'},
    {id:'reconstruct-initial',description:'Reconstruir las existencias iniciales a partir de entradas y salidas'},
    {id:'compare-orders',description:'Calcular la diferencia entre pedidos y completarla con otra aportación'},
    {id:'double-consumption',description:'Calcular un consumo por grupos antes de restarlo al almacén'}
  ];
  const symbol={add:'+',subtract:'−',multiply:'×',divide:'÷'};
  const leaf=(value,label)=>({kind:'value',value,label});
  const branch=(op,left,right)=>({kind:'operation',op,left,right});
  function solve(tree,steps=[]){if(tree.kind==='value')return tree.value;const a=solve(tree.left,steps),b=solve(tree.right,steps);const result=ProblemEngine.calculate(a,tree.op,b),remainder=tree.op==='divide'?a%b:0;steps.push({op:tree.op,left:a,right:b,result,remainder});return result;}
  function acceptable(c,steps){return steps.every(s=>(c.allowNegative||s.result>=0)&&(c.allowCarries||!['add','subtract'].includes(s.op)||!ProblemEngine.hasCarry(s.left,s.right,s.op==='subtract'))&&(s.op!=='divide'||(s.right>0&&(c.divisionMode==='exact'?s.remainder===0:c.divisionMode==='inexact'?s.remainder!==0:true))));}
  function build(c,seed,index){
    if(['P1','P2'].includes(c.grade)&&!c.allowNegative)return EarlyReadingBank.build(c,seed,index);
    if(c.allowNegative)return null;
    const selected=ops.filter(op=>c.operations.includes(op));if(!selected.length)return null;
    const level=gradeLevel(c.grade),random=seeded(seed),pick=(min,max)=>rand(random,min,max),profile=getLearningProfile(c),rank=profile.rank;
    const pool=situations.filter(x=>!c.theme||c.theme==='varied'||x.theme===c.theme);if(!pool.length)return null;
    const ctx=pool[index%pool.length],form=forms[Math.floor(index/pool.length)%forms.length],has=op=>selected.includes(op);
    const scale=profile.max/(has('multiply')?profile.factor:2);
    const a=pick(2,Math.max(3,Math.floor(scale))),n=pick(2,Math.min(profile.factor,rank===0?5:12)),b=pick(2,Math.max(3,Math.floor(scale/3))),r=pick(1,Math.max(2,Math.floor(a/3))),d=pick(2,Math.min(profile.factor,rank===0?5:12));
    let tree=leaf(a,'existencias'),sentences=[],structure=form.id,grouped=false,unit=ctx.unit;
    const variant=pick(0,5);
    const initial=value=>[
      `En ${ctx.place} hay ${value} ${ctx.unit} ${ctx.destination}.`,
      `${ctx.actor} dispone de ${value} ${ctx.unit} ${ctx.destination}.`,
      `Antes de empezar la jornada, en ${ctx.place} quedan ${value} ${ctx.unit}.`,
      `${ctx.actor} cuenta ${value} ${ctx.unit} en el almacén.`,
      `Para atender las necesidades de esta semana, ${ctx.place} dispone de ${value} ${ctx.unit}.`,
      `El inventario de ${ctx.place} registra ${value} ${ctx.unit} ${ctx.destination}.`
    ][variant];
    const incoming=value=>[`${ctx.receive} ${value} ${ctx.unit} más.`,`Llega un nuevo pedido de ${value} ${ctx.unit}.`,`Se añaden ${value} ${ctx.unit} al material disponible.`,`Esta mañana llegan ${value} ${ctx.unit} adicionales.`,`Un segundo envío contiene ${value} ${ctx.unit}.`,`A esas existencias se suman ${value} ${ctx.unit} de otro pedido.`][variant];
    const take=value=>[`${ctx.remove} ${value} ${ctx.unit}.`,`De esa cantidad, ${value} ${ctx.unit} se destinan a otra actividad.`,`Se apartan ${value} ${ctx.unit} y se trabaja con el resto.`,`Para el día siguiente se guardan ${value} ${ctx.unit}.`,`Se entregan ${value} ${ctx.unit} de las existencias disponibles.`,`Una parte del material, ${value} ${ctx.unit}, se envía a otra sede.`][variant];
    if(form.id==='reconstruct-initial'&&has('add')&&has('subtract')&&!has('multiply')&&!has('divide')){
      tree=branch('subtract',branch('add',leaf(a,'existencias finales'),leaf(r,'salidas')),leaf(Math.min(b,a-2),'entradas'));
      sentences.push(`Al cerrar la jornada, en ${ctx.place} quedan ${a} ${ctx.unit}. Durante el día se habían entregado ${r} ${ctx.unit} y se habían recibido ${Math.min(b,a-2)} más.`);
    }else if(form.id==='compare-orders'&&has('multiply')&&has('subtract')&&!has('divide')){
      const first=branch('multiply',leaf(a,'contenido primer pedido'),leaf(n,'recipientes primer pedido'));
      const second=branch('multiply',leaf(Math.max(2,Math.floor(a/2)),'contenido segundo pedido'),leaf(n-1,'recipientes segundo pedido'));
      tree=branch('subtract',first,second);
      sentences.push(`${ctx.actor} prepara dos pedidos: el primero lleva ${n} ${ctx.pack} con ${a} ${ctx.unit} por recipiente y el segundo lleva ${n-1} ${ctx.pack} con ${Math.max(2,Math.floor(a/2))} ${ctx.unit} por recipiente.`);
      if(has('add')){tree=branch('add',tree,leaf(b,'ampliación primer pedido'));sentences.push(`Al primer pedido se añaden ${b} ${ctx.unit}.`)}
    }else if(form.id==='double-consumption'&&has('multiply')&&has('subtract')){
      const total=a*n+r;tree=branch('subtract',leaf(total,'almacén'),branch('multiply',leaf(a,'consumo por equipo'),leaf(n,'equipos')));
      sentences.push(initial(total),`Participan ${n} equipos y cada uno utiliza ${a} ${ctx.unit}.`);
      if(has('add')){tree=branch('add',tree,leaf(b,'reposición'));sentences.push(incoming(b))}
    }else if(form.id==='per-container'&&has('multiply')){
      sentences.push(`${ctx.actor} prepara ${n} ${ctx.pack}. Cada recipiente contiene ${a} ${ctx.unit}.`);
      if(has('add')){tree=branch('add',tree,leaf(b,'añadidos por recipiente'));sentences.push(`A cada recipiente se añaden ${b} ${ctx.unit}.`)}
      if(has('subtract')){tree=branch('subtract',tree,leaf(r,'retirados por recipiente'));sentences.push(`De cada recipiente se retiran ${r} ${ctx.unit}.`)}
      tree=branch('multiply',tree,leaf(n,'recipientes'));sentences.push('Se reúne el contenido que queda en todos los recipientes.');
    }else if(form.id==='two-reserves'&&has('add')&&has('subtract')){
      if(has('multiply')){tree=branch('multiply',leaf(a,'contenido'),leaf(n,'paquetes'));sentences.push(`${ctx.actor} recibe ${n} ${ctx.pack} con ${a} ${ctx.unit} en cada recipiente.`)}else sentences.push(initial(a));
      const reserves=branch('add',leaf(r,'primera reserva'),leaf(b,'segunda reserva'));tree=branch('subtract',tree,reserves);
      sentences.push(`Se reservan ${r} ${ctx.unit} para una actividad y ${b} para otra. Ambas reservas salen de esas existencias.`);
    }else if(form.id==='two-sources'&&has('add')){
      const first=has('multiply')?branch('multiply',leaf(a,'contenido'),leaf(n,'paquetes')):leaf(a,'primera aportación');
      const second=has('multiply')?branch('multiply',leaf(b,'contenido'),leaf(n+1,'paquetes')):leaf(b,'segunda aportación');
      tree=branch('add',first,second);
      sentences.push(has('multiply')?`${ctx.actor} recibe dos pedidos: uno de ${n} ${ctx.pack} con ${a} ${ctx.unit} por recipiente y otro de ${n+1} ${ctx.pack} con ${b} ${ctx.unit} por recipiente.`:`En ${ctx.place} llegan ${a} ${ctx.unit} en un pedido y ${b} en otro. Se juntan los dos pedidos.`);
      if(has('subtract')){tree=branch('subtract',tree,leaf(r,'retirada'));sentences.push(take(r))}
    }else if(form.id==='remaining-delivery'&&has('add')&&has('subtract')){
      const delivery=has('multiply')?branch('multiply',leaf(b,'contenido'),leaf(n,'paquetes')):leaf(b,'pedido');
      tree=branch('add',leaf(a,'almacén'),branch('subtract',delivery,leaf(Math.min(r,b-1),'retirada del pedido')));
      sentences.push(initial(a));sentences.push(has('multiply')?`Llega un pedido de ${n} ${ctx.pack} con ${b} ${ctx.unit} en cada recipiente.`:`Llega un pedido de ${b} ${ctx.unit}.`);
      sentences.push(`Antes de guardar el pedido, se apartan ${Math.min(r,b-1)} ${ctx.unit}. El resto se suma a las existencias anteriores.`);
    }else if(form.id==='shared-first'&&has('divide')&&(has('add')||has('subtract'))){
      const total=a*d;tree=branch('divide',leaf(total,'total'),leaf(d,'destinatarios'));sentences.push(`${ctx.actor} distribuye ${total} ${ctx.unit} por igual entre ${d} equipos.`);
      if(has('add')){tree=branch('add',tree,leaf(b,'adicionales por equipo'));sentences.push(`Cada equipo recibe además ${b} ${ctx.unit}.`)}
      if(has('subtract')){tree=branch('subtract',tree,leaf(r,'consumidos por equipo'));sentences.push(`Cada equipo utiliza ${r} ${ctx.unit}.`)}
      if(has('multiply')){tree=branch('multiply',tree,leaf(n,'equipos'));sentences.push(`Se reúne el material que queda en ${n} de esos equipos.`);if(n>d)return null;}
      grouped=true;
    }else{
      structure='delivery-stock';
      if(has('multiply')){tree=branch('multiply',leaf(a,'contenido'),leaf(n,'paquetes'));sentences.push(`${ctx.actor} recibe ${n} ${ctx.pack} con ${a} ${ctx.unit} en cada recipiente.`)}else sentences.push(initial(a));
      if(has('add')){tree=branch('add',tree,leaf(b,'adicionales'));sentences.push(incoming(b))}
      if(has('subtract')){tree=branch('subtract',tree,leaf(r,'retirada'));sentences.push(take(r))}
    }
    const inverse=structure==='reconstruct-initial'&&!has('multiply')&&!has('divide');
    const comparison=structure==='compare-orders'&&has('multiply')&&has('subtract')&&!has('divide');
    const target=profile.targetSteps;
    const extensible=selected.filter(op=>op==='add'||op==='subtract');
    let extension=0;
    if(extensible.length&&!inverse&&!comparison){
      while(solveCount(tree)+(has('divide')&&!grouped?1:0)<Math.min(target,6)){
        const op=extensible[extension%extensible.length],draw=pick(2,Math.max(3,Math.floor(scale/4))),amount=op==='subtract'?Math.min(draw,solve(tree,[])-2):draw;
        if(amount<2)break;
        tree=branch(op,tree,leaf(amount,'ajuste adicional'));
        const scope=grouped&&!has('multiply')?'Cada equipo':ctx.actor;
        sentences.push(op==='add'?`${scope} recibe ${amount} ${ctx.unit} de un envío adicional.`:`${scope} guarda ${amount} ${ctx.unit} para la próxima jornada; esa reserva no se incluye en el material disponible.`);
        extension++;
      }
    }
    if(has('divide')&&!grouped){tree=branch('divide',tree,leaf(d,'unidades por grupo'));sentences.push(`Con el material que queda se preparan ${ctx.group} de ${d} ${ctx.unit}.`);unit=ctx.group;}
    const steps=[],value=solve(tree,steps);if(!acceptable(c,steps)||steps.some(s=>Math.abs(s.result)>profile.max||Math.abs(s.left)>profile.max||Math.abs(s.right)>profile.max))return null;
    if(selected.some(op=>!steps.some(s=>s.op===op)))return null;
    const remainder=steps.at(-1).op==='divide'?steps.at(-1).remainder:0;
    let question=has('divide')&&!grouped?`¿Cuántos grupos completos se pueden preparar?${remainder?` ¿Qué cantidad de ${ctx.unit} sobra?`:''}`:grouped&&!has('multiply')?`¿Qué cantidad de ${ctx.unit} le queda a cada equipo?`:inverse?`¿Qué cantidad de ${ctx.unit} había al comenzar la jornada?`:comparison?`¿Qué cantidad de ${ctx.unit} más lleva el primer pedido respecto al segundo?`:ctx.goal;
    if(grouped&&has('multiply'))question=`¿Qué cantidad de ${ctx.unit} se reúne entre esos ${n} equipos?`;
    if(value<0||!Number.isFinite(value))return null;
    return{id:uid(),template:`${structure}:${selected.join('-')}`,structure,contextId:ctx.id,topic:'Problema de '+steps.length+' pasos',grade:c.grade,theme:ctx.theme,statement:[...sentences,question].join(' '),answer:remainder?`${value} grupos; sobran ${remainder} ${ctx.unit}`:value,unit:remainder?'':unit,steps:steps.map(s=>`${s.left} ${symbol[s.op]} ${s.right} = ${s.result}${s.remainder?`, resto ${s.remainder}`:''}`),operations:selected,hint:'Distingue las cantidades por recipiente de las cantidades totales. Identifica qué se reserva y qué se reparte.',mathematicalModel:{tree,steps,answer:value},createdAt:new Date().toISOString(),favorite:false};
  }
  function solveCount(tree){return tree.kind==='value'?0:1+solveCount(tree.left)+solveCount(tree.right)}
  const inheritedGenerate=window.generate;
  const fingerprint=text=>text.toLocaleLowerCase('es').replace(/\d+(?:[.,]\d+)?/g,'#').replace(/\s+/g,' ').trim();
  window.generate=function(c){
    if(c.allowNegative||!ops.some(op=>c.operations.includes(op)))return inheritedGenerate(c);
    const past=state.data.generationHistory||{texts:[],structures:[]},texts=new Set(past.texts),structures=past.structures.slice(-25),out=[];
    for(let slot=0;slot<c.quantity;slot++){
      let best=null,bestScore=-Infinity;
      for(let attempt=0;attempt<360;attempt++){
        const index=slot*17+attempt+rand(seeded(`${c.seed}-offset`),0,10000),seed=`${c.seed}-bank-${slot}-${attempt}`;
        const p=build(c,seed,index);if(!p)continue;
        const fp=fingerprint(p.statement),key=`${p.template}:${p.contextId}`;
        if(out.some(x=>x.statement===p.statement))continue;
        const score=(texts.has(fp)?-100:30)-(structures.filter(x=>x===key).length*12)-(out.filter(x=>x.structure===p.structure).length*5);
        if(score>bestScore){best=p;bestScore=score;}if(score>=30)break;
      }
      if(!best&&!['P1','P2'].includes(c.grade)){const fallback=inheritedGenerate({...c,quantity:1,seed:`${c.seed}-fallback-${slot}`})[0];if(fallback)best=fallback;}
      if(best){out.push(best);texts.add(fingerprint(best.statement));structures.push(`${best.template}:${best.contextId||best.theme}`);}
    }
    if(out.length<c.quantity)toast(`Se han generado ${out.length} problemas breves con estos filtros. Reduce la cantidad o permite llevadas.`);
    state.data.generationHistory={texts:[...texts].slice(-1200),structures:structures.slice(-120)};persist();return out;
  };
  window.StoryBank={build,solve,fingerprint,situations,forms};
  document.getElementById('templateCount').textContent=String(situations.length+7);
  document.querySelector('.template-count span').textContent='contextos · 9 modelos nuevos de cálculo';
})();
