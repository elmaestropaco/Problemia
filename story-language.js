/* Redacción ligada a acciones reales. Las cantidades proceden siempre del modelo. */
(() => {
  const activities={
    museum:['folleto','Los visitantes se llevan','para las visitas de la mañana'],
    camp:['barrita de cereales','Durante la ruta se comen','para la excursión'],
    hostel:['toalla','Los huéspedes usan','para las habitaciones'],
    station:['mapa','Los turistas se llevan','para quienes visitan la ciudad'],
    science:['tubo de ensayo','En las prácticas se usan','para la clase de ciencias'],
    art:['pincel','El alumnado se lleva','para la clase de plástica'],
    music:['partitura','El coro toma prestadas','para el ensayo'],
    robotics:['pieza de construcción','Para construir un robot se usan','para construir robots'],
    aquarium:['porción de alimento','Para alimentar a los peces se usan','para los peces'],
    shelter:['lata de comida','Para dar de comer a los animales se abren','para los animales'],
    orchard:['bulbo','En el jardín se plantan','para plantar en el jardín'],
    recycling:['tapón','Para un mural se usan','para hacer un mural'],
    swim:['gorro de natación','Los nadadores se llevan','para las clases de natación'],
    athletics:['dorsal','Los corredores recogen','para la carrera'],
    tennis:['pelota de tenis','Para un torneo se prestan','para las clases de tenis'],
    stadium:['pulsera de acceso','A la entrada del torneo se entregan','para el torneo'],
    bakery:['magdalena','Durante la mañana se venden','para la venta de hoy'],
    hardware:['tornillo','Un cliente compra','para vender en la tienda'],
    market:['naranja','Durante la mañana se venden','para vender en el mercado'],
    printing:['tarjeta','A los visitantes se les entregan','para una feria']
  };
  const packs={cajas:'caja',paquetes:'paquete',bandejas:'bandeja',carpetas:'carpeta',bolsas:'bolsa',estuches:'estuche',botes:'bote'};
  const shortNames={tennis:'pelotas',swim:'gorros',camp:'barritas',robotics:'piezas',aquarium:'porciones de alimento',shelter:'latas de comida'};
  const female=new Set(['barritas de cereales','toallas','partituras','piezas de construcción','porciones de alimento','latas de comida','pelotas de tenis','pulseras de acceso','magdalenas','naranjas','tarjetas']);
  const q=(ctx,n)=>`${n} ${n===1?activities[ctx.id]?.[0]||ctx.unit:ctx.unit}`;
  function opening(ctx,n,variant,length){
    const purpose=activities[ctx.id]?.[2]||ctx.destination;
    const options=[`En ${ctx.place} hay ${q(ctx,n)} ${purpose}.`,`${ctx.actor} tiene ${q(ctx,n)} ${purpose}.`,`Al empezar el día, en ${ctx.place} hay ${q(ctx,n)}.`,`${ctx.actor} ha guardado ${q(ctx,n)} ${purpose}.`];
    return length==='short'?`En ${ctx.place} hay ${q(ctx,n)}.`:options[variant%options.length];
  }
  function shipment(ctx,containers,perContainer){const pack=packs[ctx.pack];if(!pack)throw Error('El envase necesita un nombre concreto.');return ctx.id==='camp'?`Para el campamento llegan ${containers} ${ctx.pack} con ${q(ctx,perContainer)} en cada ${pack}.`:`${ctx.actor} recibe ${containers} ${ctx.pack} con ${q(ctx,perContainer)} en cada ${pack}.`;}
  function receive(ctx,n,variant){if(ctx.id==='camp')return `Además, reciben ${q(ctx,n)} para la excursión.`;return [`${ctx.receive} ${q(ctx,n)} más.`,`Llega otro pedido con ${q(ctx,n)}.`,`También reciben ${q(ctx,n)} de otro envío.`,`${ctx.actor} recibe ${q(ctx,n)} más.`][variant%4]}
  function take(ctx,n,variant){
    if(ctx.id==='swim'&&variant%3===0)return n===1?'Un nadador recibe 1 gorro de natación.':`Se entregan ${q(ctx,n)} a los nadadores.`;
    if(variant%3===0){let action=activities[ctx.id]?.[1]||ctx.remove;if(n===1)action=action.replace(/se comen$/,'se come').replace(/se usan$/,'se usa').replace(/se abren$/,'se abre').replace(/se plantan$/,'se planta').replace(/se prestan$/,'se presta').replace(/se venden$/,'se vende').replace(/se entregan$/,'se entrega').replace(/se les entregan$/,'se les entrega').replace(/toma prestadas$/,'toma prestada');return `${action} ${q(ctx,n)}.`;}
    return variant%3===1?`Se ${n===1?'guarda':'guardan'} ${q(ctx,n)} para el día siguiente.`:`Para otra actividad se ${n===1?'lleva':'llevan'} ${q(ctx,n)}.`;
  }
  const count=(ctx,noun=shortNames[ctx.id]||ctx.unit)=>`${female.has(ctx.unit)?'Cuántas':'Cuántos'} ${noun}`;
  function question(ctx,{removed=false,reserved=false,grouped=false,combined=false,teams=0}={}){
    const what=count(ctx);
    if(grouped){if(combined)return `¿${what} ${removed?'quedan':'hay'} en total entre esos ${teams} equipos?`;return removed?`¿${what} le quedan a cada equipo?`:`¿${what} tiene ahora cada equipo?`;}
    if(reserved)return `¿${what} quedan disponibles, sin contar las reservas?`;
    return removed?`¿${what} quedan?`:`¿${what} hay en total?`;
  }
  function groupQuestion(ctx,remainder=0){const feminine=/^(bolsas|cajas|carpetas)/.test(ctx.group);return `¿${feminine?'Cuántas':'Cuántos'} ${ctx.group} ${feminine?'completas':'completos'} se pueden preparar?${remainder?` ¿${count(ctx)} sobran?`:''}`;}
  window.StoryLanguage={q,packs,opening,receive,take,count,shipment,question,groupQuestion};
})();
