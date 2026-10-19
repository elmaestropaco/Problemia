/* Números racionales exactos y contenidos especializados. Sin eval ni redondeos ocultos. */
(() => {
  const arithmetic=['add','subtract','multiply','divide'];
  const features=['decimal','fraction','percent','measure','geometry','proportion','divisibility','power','root','equation','logic'];
  const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1};
  function rational(n,d=1){if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||!d)throw Error('Cantidad fuera de los límites del modelo.');if(d<0){n=-n;d=-d}const g=gcd(n,d);return {n:n/g,d:d/g};}
  const value=(n,d=1,label='dato')=>({kind:'value',value:rational(n,d),label});
  const node=(op,left,right)=>({kind:'operation',op,left,right});
  function operate(a,op,b){if(op==='add')return rational(a.n*b.d+b.n*a.d,a.d*b.d);if(op==='subtract')return rational(a.n*b.d-b.n*a.d,a.d*b.d);if(op==='multiply')return rational(a.n*b.n,a.d*b.d);if(op==='divide')return rational(a.n*b.d,a.d*b.n);throw Error('Operación desconocida.');}
  function solve(tree,steps=[]){if(tree.kind==='value')return tree.value;const a=solve(tree.left,steps),b=solve(tree.right,steps),result=operate(a,tree.op,b);steps.push({op:tree.op,left:a,right:b,result});return result;}
  function format(v){if(v.d===1)return String(v.n);let d=v.d;while(d%2===0)d/=2;while(d%5===0)d/=5;if(d===1&&v.d<=1000)return fmt(v.n/v.d);return `${v.n}/${v.d}`;}
  const symbols={add:'+',subtract:'−',multiply:'×',divide:'÷'};
  function build(c,seed,index){
    const selected=features.filter(x=>c.operations.includes(x)),explicit=arithmetic.filter(x=>c.operations.includes(x));
    const bases=selected.filter(x=>['measure','geometry','proportion','divisibility','power','root','equation'].includes(x));
    if(bases.length>1)throw Error('En cada problema se permite un tema principal, más decimales, fracciones, porcentajes y operaciones. Para repartir varios temas principales, elige «Repartir y mezclar en la colección».');
    const rng=seeded(seed),pick=(a,b)=>rand(rng,a,b),profile=getLearningProfile(c),rank=profile.rank,level=gradeLevel(c.grade);
    let tree=value(pick(6,Math.min(80,profile.max))),unit='€',sentences=[],extra=[],semantic=null,baseQuestion='';
    const base=bases[0];
    if(base==='geometry'){
      const a=pick(3,Math.min(40,4+level*2+rank*4)),b=pick(2,Math.min(20,3+level+rank*2));
      if(index%2){tree=node('multiply',node('add',value(a),value(b)),value(2));unit='cm';sentences.push(`Una foto rectangular mide ${a} cm de largo y ${b} cm de ancho. Se quiere poner una cinta alrededor de los cuatro lados.`);}
      else{tree=node('multiply',value(a),value(b));unit='cm²';sentences.push(`Una hoja rectangular mide ${a} cm de largo y ${b} cm de ancho.`);if(rank>=2&&level>=4){const cut=pick(1,Math.min(a,b)-1);tree=node('subtract',tree,node('multiply',value(cut),value(cut)));sentences.push(`Se recorta y retira un cuadrado de ${cut} cm de lado. Queremos calcular el área del papel que queda.`);}else sentences.push('Queremos calcular su área.');}
    }else if(base==='measure'){
      const types=[['litros','mililitros','ml','agua para una receta',1000],['kilogramos','gramos','g','arroz en una cocina',1000],['metros','centímetros','cm','cinta para una manualidad',100]];
      const [from,to,symbol,context,factor]=types[index%types.length],amount=pick(2,Math.min(40,4+level*2+rank*5));tree=node('multiply',value(amount),value(factor));unit=symbol;sentences.push(`Hay ${amount} ${from} de ${context}. Expresa esa cantidad en ${to} antes de seguir.`);
    }else if(base==='proportion'){
      const people=pick(2,6),grams=people*pick(20,80),target=people*pick(2,4);
      if(index%2&&gradeLevel(c.grade)>=7){const hours=pick(2,8);tree=node('divide',node('multiply',value(people),value(hours)),value(target));unit='h';sentences.push(`${people} máquinas iguales terminan un trabajo en ${hours} horas. Para hacer el mismo trabajo se usan ${target} máquinas, todas al mismo ritmo.`);baseQuestion=`¿Cuántas horas tardarán las ${target} máquinas?`;}
      else{tree=node('multiply',node('divide',value(grams),value(people)),value(target));unit='g';sentences.push(`Una receta para ${people} personas lleva ${grams} g de arroz. Se prepara la misma receta para ${target} personas, con la misma cantidad por persona.`);}
    }else if(base==='equation'){
      const x=pick(2,8+rank*2),a=pick(2,4+rank*2),b=pick(2,6+rank*5),total=a*x+b;tree=node('divide',node('subtract',value(total),value(b)),value(a));unit='€';sentences.push(`En una tienda, ${a} cuadernos del mismo precio y una carpeta de ${b} € cuestan ${total} €. Llama x al precio de un cuaderno y encuentra su valor.`);extra.push(`Ecuación: ${a}x + ${b} = ${total}`);
    }else if(base==='power'){
      const exp=rank<2?2:3,a=pick(2,Math.max(3,Math.min(profile.factor,Math.floor(profile.max**(1/exp)))));tree=value(a);for(let j=1;j<exp;j++)tree=node('multiply',tree,value(a));unit='fichas';sentences.push(`Hay ${a} cajas con ${a} bolsas en cada caja y ${a} fichas en cada bolsa.`);if(exp===2)sentences[0]=`Hay ${a} bolsas con ${a} fichas en cada bolsa.`;extra.push(`${a}^${exp} = ${a**exp}`);
    }else if(base==='root'){
      const degree=rank>=2&&level>=7?3:2,length=pick(2,Math.max(3,Math.floor(profile.max**(1/degree)))),amount=length**degree;
      tree=value(length,1,'root');semantic={kind:'root',values:[amount],degree};unit='cm';
      sentences.push(degree===2?`Un cuadrado tiene un área de ${amount} cm². Queremos averiguar la longitud de su lado.`:`Un cubo tiene un volumen de ${amount} cm³. Queremos averiguar la longitud de una arista, es decir, uno de sus lados.`);
      extra.push(`Raíz ${degree===2?'cuadrada':'cúbica'} de ${amount} = ${length}`);
    }else if(base==='divisibility'){
      const g=pick(2,Math.min(20,4+level+rank*3)),[m,n]=[[2,3],[3,5],[4,7],[5,8],[7,9]][index%5],a=g*m,b=g*n;
      if(index%2){tree=value(g*m*n,1,'lcm');semantic={kind:'lcm',values:[a,b]};unit='min';sentences.push(`Dos autobuses salen juntos de una parada. Uno sale cada ${a} minutos y el otro cada ${b} minutos. Queremos saber cuánto tiempo pasa hasta que vuelven a salir juntos.`);extra.push(`MCM(${a}, ${b}) = ${g*m*n}`);}
      else{tree=value(g,1,'gcd');semantic={kind:'gcd',values:[a,b]};unit='lotes';sentences.push(`Hay ${a} lápices y ${b} gomas. Se quiere hacer el mayor número de lotes iguales usando todo el material. Cada lote debe tener la misma cantidad de lápices y la misma cantidad de gomas que los demás.`);extra.push(`MCD(${a}, ${b}) = ${g}`);}
    }else if(selected.includes('decimal')){
      let cents=pick(125,Math.min(profile.max*100,500+level*300+rank*1800));if(cents%100===0)cents--;tree=value(cents,100);tree.contents=['decimal'];sentences.push(`Una clase tiene ${format(tree.value)} € para comprar material.`);
    }else if(selected.includes('fraction')){
      unit='l';tree=value(pick(4,12));sentences.push(`En una jarra hay ${format(tree.value)} litros de zumo.`);
    }else if(selected.includes('percent')){
      tree=value(pick(4,15)*10);sentences.push(`Una mochila cuesta ${format(tree.value)} €.`);
    }else{
      unit='puntos';tree=value(pick(4,20));sentences.push(`Un equipo tiene ${format(tree.value)} puntos en un juego.`);
    }
    const price=base==='equation'||!base&&!selected.includes('decimal')&&selected.includes('percent'),language=AdvancedLanguage.create(base,unit,price);
    if(base)tree.contents=[base];
    const modified=explicit.length||selected.some(x=>['decimal','fraction','percent'].includes(x));
    if(base==='root'&&modified)sentences.push('Se corta una cinta de la misma longitud que ese lado.');
    if(base==='divisibility'&&index%2&&modified)sentences.push('Ese intervalo entre salidas será el tiempo previsto para un juego.');
    if(selected.includes('decimal')&&base){let numerator=pick(11,29);if(numerator%10===0)numerator++;const amount=value(numerator,10);tree=node('add',tree,amount);tree.contents=['decimal'];sentences.push(language.add(format(amount.value)));}
    if(selected.includes('fraction')){const den=pick(2,rank<2?4:8),num=pick(1,den-1);tree=node('multiply',tree,value(num,den));tree.contents=['fraction'];sentences.push(language.part(num,den));}
    if(selected.includes('percent')){const p=[10,20,25,50][pick(0,3)],increase=index%2===1;tree=node('multiply',tree,value(increase?100+p:100-p,100));tree.contents=['percent'];sentences.push(language.percent(p,increase));if(rank>=2&&level>=5){tree=node('multiply',tree,value(90,100));const next=language.percent(10,false);sentences.push('Después, '+next.charAt(0).toLowerCase()+next.slice(1));}}
    if(selected.includes('decimal')&&!base&&!selected.some(x=>['fraction','percent'].includes(x))&&!explicit.length){const amount=value(pick(101,399),100);tree=node(index%2?'subtract':'add',tree,amount);if(index%2&&solve(tree,[]).n<0)return null;sentences.push(index%2?`La clase gasta ${format(amount.value)} € en cartulinas.`:`Una familia entrega otros ${format(amount.value)} €.`);}
    const pureLogic=selected.length===1&&selected[0]==='logic'&&!explicit.length;
    if(pureLogic){const initial=tree.value.n,increment=pick(2,6);tree=node('add',tree,value(increment*4));unit='';sentences=[`Una lista empieza por ${initial}, ${initial+increment}, ${initial+increment*2}. Cada número se obtiene sumando ${increment} al anterior. ¿Qué número ocupa el quinto lugar?`];}
    for(const op of explicit){
      const current=solve(tree,[]);let amount;
      if(op==='add'||op==='subtract'){
        const max=Math.max(1,Math.min(10,Math.floor(current.n/current.d)-1));const integer=pick(1,max);amount=value(integer);
        if(selected.includes('decimal'))amount=value(integer*100+pick(1,25),100);
        if(op==='subtract'&&!c.allowNegative&&current.n/current.d<amount.value.n/amount.value.d)amount=value(1,Math.max(2,current.d));
        sentences.push(language[op](format(amount.value)));
      }else if(op==='multiply'){amount=value(pick(2,5));sentences.push(language.multiply(format(amount.value)));}
      else{amount=value(pick(2,6));sentences.push(language.divide(format(amount.value)));}
      tree=node(op,tree,amount);
    }
    // Aumentar la dependencia entre cálculos sin introducir operaciones no elegidas.
    if(explicit.length&&rank>=2){
      const repeats=Math.max(0,profile.targetSteps-explicit.length-1);
      for(let k=0;k<repeats;k++){
        const chosen=explicit[k%explicit.length];
        if(chosen==='add'){const amount=value(pick(1,5));tree=node(chosen,tree,amount);sentences.push(language.add(format(amount.value)));}
        else if(chosen==='subtract'){const amount=value(1);if(solve(tree,[]).n/solve(tree,[]).d>=1||c.allowNegative){tree=node(chosen,tree,amount);sentences.push(language.subtract('1'));}}
        else if(chosen==='multiply'){tree=node(chosen,tree,value(2));sentences.push(language.multiply('2'));}
        else{tree=node(chosen,tree,value(2));sentences.push(language.divide('2'));}
      }
    }
    const steps=[],answer=solve(tree,steps);if(!c.allowNegative&&answer.n<0)return null;
    if(['fichas','lotes'].includes(unit)&&(answer.d!==1||steps.some(s=>s.result.d!==1)))return null;
    if(unit==='€'&&(100%answer.d!==0||steps.some(s=>100%s.result.d!==0)))return null;
    const limit=base==='measure'?profile.max*1000:profile.max;
    if(steps.some(s=>Math.abs(s.result.n/s.result.d)>limit))return null;
    if(!c.allowCarries&&steps.some(s=>{if(!['add','subtract'].includes(s.op)||s.left.n<0||s.right.n<0)return false;const common=s.left.d*s.right.d/gcd(s.left.d,s.right.d);return ProblemEngine.hasCarry(s.left.n*(common/s.left.d),s.right.n*(common/s.right.d),s.op==='subtract')}))return null;
    if(selected.includes('logic')){sentences.push('Explica cómo sabes que el resultado encaja con los datos.');tree.contents=[...(tree.contents||[]),'logic'];}
    const question=base==='divisibility'&&!modified?semantic.kind==='lcm'?'¿Cuántos minutos pasan hasta que vuelven a salir juntos?':'¿Cuántos lotes se pueden hacer?':base==='root'&&!modified?'¿Cuántos centímetros mide ese lado?':base==='equation'&&!modified?'¿Cuánto cuesta un cuaderno?':baseQuestion&&!modified?baseQuestion:language.question();
    const names={decimal:'Decimales',fraction:'Fracciones',percent:'Porcentajes',measure:'Medidas',geometry:'Geometría',proportion:'Proporcionalidad',divisibility:'Divisibilidad',power:'Potencias',root:'Raíces exactas',equation:'Ecuaciones',logic:'Lógica'};
    return{id:uid(),template:`advanced:${selected.join('-')}:${explicit.join('-')}`,topic:selected.map(x=>names[x]).join(' · '),grade:c.grade,theme:c.theme,statement:[...sentences,pureLogic?'':question].filter(Boolean).join(' '),answer:format(answer),unit,exactAnswer:answer,mathematicalModel:{numeric:'rational',tree,steps,answer,semantic},operations:explicit,contents:selected,steps:[...extra,...steps.map(s=>`${format(s.left)} ${symbols[s.op]} ${format(s.right)} = ${format(s.result)}`)],hint:'Trabaja con cantidades exactas. Distingue la cantidad total de la parte que se usa.',createdAt:new Date().toISOString(),favorite:false};
  }
  const previousGenerate=window.generate;
  window.generate=function(c){if(!features.some(x=>c.operations.includes(x)))return previousGenerate(c);const out=[],seen=new Set();for(let i=0;out.length<c.quantity&&i<1000;i++){const p=build(c,`${c.seed}-advanced-${i}`,i+(c.variantOffset||0));if(p&&!seen.has(p.statement)){seen.add(p.statement);out.push(p)}}if(out.length<c.quantity)throw Error('No hay suficientes problemas con esos filtros. Ajusta las cantidades o el curso.');return out;};
  window.AdvancedBank={rational,operate,solve,format,build};
})();
