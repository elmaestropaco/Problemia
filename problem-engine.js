/* Modelos de cantidades: las frases, los pasos y la respuesta comparten datos. */
(() => {
  const operations=['add','subtract','multiply','divide'];
  const presets={P1:[20,1],P2:[100,1],P3:[1000,2],P4:[5000,2],P5:[10000,3],P6:[20000,3],E1:[50000,4],E2:[100000,4]};
  const contexts=[
    {id:'library',theme:'classroom',unit:'libros',start:n=>`La biblioteca del colegio tenía ${n} libros disponibles para préstamo.`,add:n=>`Una asociación dona ${n} libros.`,sub:n=>`El alumnado se lleva prestados ${n} libros.`,mul:n=>`Otras ${n-1} bibliotecas aportan cada una tantos libros como quedan disponibles en la primera. Se reúnen todos para una feria de lectura.`,div:n=>`Los libros se distribuyen en lotes de ${n} para enviarlos a otras bibliotecas.`,question:'¿Cuántos libros quedan disponibles?',group:'¿Cuántos lotes completos pueden enviar?',pack:(a,b)=>`La biblioteca recibe ${a} cajas con ${b} libros en cada una.`},
    {id:'school',theme:'classroom',unit:'cuadernos',start:n=>`El colegio tiene ${n} cuadernos para repartir al comienzo del curso.`,add:n=>`La papelería entrega ${n} cuadernos más.`,sub:n=>`Se reservan ${n} cuadernos para las nuevas matrículas.`,mul:n=>`Otros ${n-1} colegios aportan cada uno la misma cantidad de cuadernos que queda. Se juntan todas las aportaciones.`,div:n=>`Se preparan paquetes de ${n} cuadernos.`,question:'¿Cuántos cuadernos hay para repartir?',group:'¿Cuántos paquetes completos se pueden preparar?',pack:(a,b)=>`El colegio recibe ${a} cajas con ${b} cuadernos en cada caja.`},
    {id:'garden',theme:'nature',unit:'semillas',start:n=>`En el huerto escolar quedan ${n} semillas de judía para la próxima siembra.`,add:n=>`Una familia dona ${n} semillas.`,sub:n=>`La clase planta ${n} semillas en los semilleros.`,mul:n=>`Otros ${n-1} huertos aportan cada uno tantas semillas como quedan sin plantar. Se juntan todas para una campaña de siembra.`,div:n=>`Se llenan sobres con ${n} semillas en cada uno.`,question:'¿Cuántas semillas quedan sin plantar?',group:'¿Cuántos sobres completos se pueden llenar?',pack:(a,b)=>`Para el huerto escolar llegan ${a} sobres con ${b} semillas de judía en cada sobre.`},
    {id:'nursery',theme:'nature',unit:'plantones',start:n=>`Un vivero dispone de ${n} plantones para una jornada de reforestación.`,add:n=>`Otro vivero dona ${n} plantones.`,sub:n=>`Se apartan ${n} plantones para reponer árboles dañados.`,mul:n=>`Otros ${n-1} viveros aportan cada uno la misma cantidad de plantones que queda. Todas las aportaciones se reúnen en el almacén.`,div:n=>`Se entregan los plantones en lotes de ${n}.`,question:'¿Cuántos plantones hay para la jornada?',group:'¿Cuántos lotes completos se pueden entregar?',pack:(a,b)=>`Un vivero prepara ${a} bandejas con ${b} plantones en cada una.`},
    {id:'sport',theme:'sport',unit:'botellas de agua',start:n=>`Para un torneo se almacenan ${n} botellas de agua.`,add:n=>`Un patrocinador entrega ${n} botellas más.`,sub:n=>`Durante el entrenamiento se consumen ${n} botellas.`,mul:n=>`Otros ${n-1} patrocinadores aportan cada uno tantas botellas como quedan en el almacén. Se juntan todas para el torneo.`,div:n=>`Se preparan bolsas con ${n} botellas para cada equipo.`,question:'¿Cuántas botellas quedan para el torneo?',group:'¿Para cuántos equipos se pueden preparar bolsas completas?',pack:(a,b)=>`Para un torneo llegan ${a} cajas con ${b} botellas de agua en cada caja.`},
    {id:'shop',theme:'shopping',unit:'manzanas',start:n=>`Una frutería tiene ${n} manzanas en su almacén.`,add:n=>`El proveedor entrega ${n} manzanas.`,sub:n=>`A lo largo de la mañana se venden ${n} manzanas.`,mul:n=>`Otras ${n-1} fruterías aportan cada una tantas manzanas como quedan en la primera. Se reúnen todas para una compra colectiva.`,div:n=>`Las manzanas se envasan en bolsas de ${n}.`,question:'¿Cuántas manzanas quedan en el almacén?',group:'¿Cuántas bolsas completas se pueden preparar?',pack:(a,b)=>`Una frutería recibe ${a} cajas con ${b} manzanas en cada caja.`},
    {id:'travel',theme:'travel',unit:'bocadillos',start:n=>`Para una excursión, el comedor prepara ${n} bocadillos.`,add:n=>`Las familias aportan ${n} bocadillos más.`,sub:n=>`Se reservan ${n} bocadillos para las personas acompañantes.`,mul:n=>`Otros ${n-1} comedores preparan cada uno tantos bocadillos como quedan para el alumnado. Se juntan todas las aportaciones.`,div:n=>`Los bocadillos se reparten en bolsas de ${n} para los grupos de la excursión.`,question:'¿Cuántos bocadillos hay para el alumnado?',group:'¿Cuántas bolsas completas se pueden preparar?',pack:(a,b)=>`Para una excursión se preparan ${a} bandejas con ${b} bocadillos en cada bandeja.`}
  ];
  function hasCarry(a,b,subtract=false){if(a<0||b<0)return false;while(a||b){if(subtract?(a%10<b%10):(a%10+b%10>=10))return true;a=Math.floor(a/10);b=Math.floor(b/10)}return false}
  function calculate(a,op,b){if(op==='add')return a+b;if(op==='subtract')return a-b;if(op==='multiply')return a*b;if(!b)throw Error('Divisor cero');return Math.floor(a/b)}
  const symbols={add:'+',subtract:'−',multiply:'×',divide:'÷'};
  const alternateActions={
    library:{add:n=>`Se devuelven ${n} libros que estaban prestados.`,subtract:n=>`Se envían ${n} libros a otra biblioteca.`},
    school:{add:n=>`Una campaña solidaria aporta ${n} cuadernos.`,subtract:n=>`Se entregan ${n} cuadernos a una asociación.`},
    garden:{add:n=>`Se recuperan ${n} semillas de la cosecha anterior.`,subtract:n=>`Se guardan ${n} semillas para estudiar su germinación.`},
    nursery:{add:n=>`Llegan ${n} plantones de otro invernadero.`,subtract:n=>`Se envían ${n} plantones a un parque municipal.`},
    sport:{add:n=>`El club compra ${n} botellas más.`,subtract:n=>`Se reservan ${n} botellas para el personal de organización.`},
    shop:{add:n=>`Llega un segundo pedido de ${n} manzanas.`,subtract:n=>`Se envían ${n} manzanas a un comedor escolar.`},
    travel:{add:n=>`El comedor prepara otros ${n} bocadillos al confirmarse nuevas inscripciones.`,subtract:n=>`Se guardan ${n} bocadillos para el viaje de regreso.`}
  };
  function create(c,seed,index){
    const chosen=operations.filter(op=>c.operations.includes(op));
    if(!chosen.length)return null;
    const random=seeded(seed),level=gradeLevel(c.grade),profile=getLearningProfile(c),rank=profile.rank;
    const preset=presets[c.grade]||presets.P3,limit=profile.max;
    const pool=contexts.filter(x=>c.theme==='varied'||!c.theme||x.theme===c.theme),ctx=pool[index%pool.length];
    let order=chosen.slice();
    // El producto inicial representa cajas o bandejas con una cantidad por unidad.
    if(order.includes('multiply')&&index%3!==2)order=['multiply',...order.filter(op=>op!=='multiply')];
    if(order.includes('divide'))order=[...order.filter(op=>op!=='divide'),'divide'];
    const extra=Math.max(0,profile.targetSteps-order.length);
    if(extra){const allowed=chosen.filter(op=>op!=='divide');for(let j=0;j<extra&&allowed.length;j++)order.splice(order.at(-1)==='divide'?order.length-1:order.length,0,allowed[(index+j)%allowed.length]);}
    const negative=!!c.allowNegative && !chosen.includes('divide');
    let current=negative?-rand(random,2,Math.max(3,Math.floor(limit/3))):rand(random,Math.max(2,Math.floor(limit/5)),Math.max(3,Math.floor(limit/2)));
    const initial=current,model=[],sentences=[],steps=[],occurrences={};let opening=ctx.start(current);
    if(negative)opening=`Al comenzar una ronda, un equipo tiene un saldo de ${current} puntos. Los puntos negativos representan penalizaciones pendientes.`;
    for(let j=0;j<order.length;j++){
      const op=order[j];let operand;
      if(op==='multiply')operand=rand(random,2,Math.min(profile.factor,rank===0?6:profile.factor));
      else if(op==='divide')operand=rand(random,2,level<2?5:level<4?12:rank===0?12:30);
      else operand=rand(random,2,Math.max(3,Math.floor(limit/(rank===0?8:4))));
      if(op==='subtract'&&!negative)operand=Math.min(operand,current-1);
      if(operand<1)return null;
      if(!c.allowCarries&&(op==='add'||op==='subtract')&&hasCarry(Math.abs(current),operand,op==='subtract'))return null;
      const before=current;
      if(op==='divide'){
        const remainder=before%operand;
        if(c.divisionMode==='exact'&&remainder!==0)return null;
        if(c.divisionMode==='inexact'&&remainder===0)return null;
      }
      current=calculate(before,op,operand);
      if(!negative&&current<0)return null;
      if(Math.abs(current)>profile.max)return null;
      const remainder=op==='divide'?before%operand:0;
      model.push({op,left:before,right:operand,result:current,remainder});
      steps.push(`${before} ${symbols[op]} ${operand} = ${current}${remainder?`, resto ${remainder}`:''}`);
      if(negative){sentences.push(op==='add'?`En la siguiente prueba gana ${operand} puntos.`:op==='subtract'?`Recibe una penalización de ${operand} puntos.`:`La última prueba multiplica por ${operand} el saldo que lleva acumulado.`)}
      else if(j===0&&op==='multiply'){opening=ctx.pack(operand,before);}
      else {
        const repeated=occurrences[op]>0;
        const action=repeated&&alternateActions[ctx.id][op]?alternateActions[ctx.id][op]:ctx[op==='add'?'add':op==='subtract'?'sub':op==='multiply'?'mul':'div'];
        sentences.push(action(operand));
      }
      occurrences[op]=(occurrences[op]||0)+1;
    }
    const last=model.at(-1),remainder=last.op==='divide'?last.remainder:0;
    const question=negative?'¿Cuál es el saldo de puntos del equipo al terminar?':last.op==='divide'?`${ctx.group}${remainder?' ¿Qué cantidad de '+ctx.unit+' sobra?':''}`:ctx.question;
    return{id:uid(),template:`${ctx.id}:${order.join('-')}`,topic:'Problema de '+model.length+' pasos',grade:c.grade,statement:[opening,...sentences,question].join(' '),answer:last.op==='divide'&&remainder?`${current} grupos completos; sobran ${remainder} ${ctx.unit}`:current,unit:last.op==='divide'?(remainder?'':'grupos'):negative?'puntos':ctx.unit,steps,hint:'Relaciona las cantidades del enunciado. Comprueba qué representa cada resultado antes de continuar.',mathematicalModel:{initial,steps:model,answer:current},operations:chosen,theme:ctx.theme,createdAt:new Date().toISOString(),favorite:false};
  }
  // Solo se muestran estructuras ejecutables; nombres de variantes no cuentan como estructuras nuevas.
  const arithmeticCatalog=[];
  for(let mask=1;mask<16;mask++){const ops=operations.filter((op,i)=>mask&(1<<i));for(const ctx of contexts)arithmeticCatalog.push({id:`${ctx.id}:${ops.join('-')}`,ops,theme:ctx.theme});}
  window.problemTemplateCatalog=arithmeticCatalog;
  document.getElementById('templateCount').textContent=String(arithmeticCatalog.length);
  document.querySelector('.template-count span').textContent='combinaciones de contexto y operaciones';
  window.generate=function(c){
    const arithmetic=operations.filter(op=>c.operations.includes(op));
    if(arithmetic.length){const out=[],seen=new Set();for(let attempt=0;out.length<c.quantity&&attempt<20000;attempt++){const p=create(c,`${c.seed}-model-${attempt}`,out.length+Math.floor(attempt/50));if(p&&!seen.has(p.statement)){seen.add(p.statement);out.push(p)}}if(out.length<c.quantity)toast(`Se han podido generar ${out.length} problemas con estas restricciones. Prueba a permitir llevadas.`);return out;}
    return [];
  };
  window.ProblemEngine={create,hasCarry,calculate,catalog:arithmeticCatalog};
})();
