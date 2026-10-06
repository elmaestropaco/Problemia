/* Retos numéricos con reglas explícitas y soluciones únicas. */
(() => {
  const previous=window.generate;
  const v=n=>({kind:'value',value:AdvancedBank.rational(n),label:'dato'});
  const op=(name,left,right)=>({kind:'operation',op:name,left,right});
  function build(c,index){
    const rng=seeded(`${c.seed}-logic-${index}`),pick=(a,b)=>rand(rng,a,b),p=getLearningProfile(c);
    const level=gradeLevel(c.grade),hard=p.rank>=2,a=pick(1,Math.min(20,p.max-4)),b=pick(1,level<2?3:9);
    const form=index%(level<2?3:6);let tree,text,explanation;
    if(form===0){
      const position=hard?7:5;tree=op('add',v(a),op('multiply',v(b),v(position-1)));
      text=`Una fila de números empieza por ${a}, ${a+b}, ${a+2*b}. La regla es sumar ${b} cada vez. ¿Qué número estará en el lugar ${position}?`;
      explanation=`Desde el primer lugar hay que avanzar ${position-1} veces, no ${position}.`;
    }else if(form===1){
      const total=a+b;tree=op('subtract',v(total),v(a));
      text=`Hay ${total} fichas entre dos cajas cerradas. La primera contiene ${a}. Todas las fichas están en una de esas dos cajas. ¿Cuántas contiene la segunda?`;
      explanation='Las cantidades de las dos cajas deben sumar el total.';
    }else if(form===2){
      tree=op('add',v(a),v(b));
      text=`En una fila, Nora tiene ${a} personas delante. Leo está ${b} lugares más atrás que Nora. ¿Cuántas personas tiene Leo delante?`;
      explanation='Estar más atrás significa tener más personas delante. No se cuenta a Leo.';
    }else if(form===3){
      const factor=pick(2,hard?4:3),position=hard?5:4;tree=v(a);
      for(let k=1;k<position;k++)tree=op('multiply',tree,v(factor));
      const list=[a,a*factor,a*factor*factor].join(', ');
      text=`La lista ${list} sigue esta regla: cada número es ${factor} veces el anterior. ¿Qué número estará en el lugar ${position}?`;
      explanation='Aplica la misma regla a cada paso; no sumes una diferencia fija.';
    }else if(form===4){
      const result=a*2+b;tree=op('divide',op('subtract',v(result),v(b)),v(2));
      text=`Una máquina de números duplica el número que entra y después le suma ${b}. Sale el número ${result}. ¿Qué número entró?`;
      explanation='Para deshacer el proceso, primero resta lo que se sumó y después divide entre dos.';
    }else{
      const second=pick(1,6),position=hard?7:5,transitions=position-1;
      const increments=Array.from({length:transitions},(_,k)=>k%2?second:b);
      tree=v(a);for(const increment of increments)tree=op('add',tree,v(increment));
      text=`Una lista empieza por ${a}, ${a+b}, ${a+b+second}. Se suma ${b}, luego ${second}, y se repiten esos dos pasos en ese orden. ¿Qué número estará en el lugar ${position}?`;
      explanation='Marca los pasos por parejas para no cambiar el orden de las dos reglas.';
    }
    const steps=[],answer=AdvancedBank.solve(tree,steps);
    if(steps.some(s=>Math.abs(s.result.n/s.result.d)>p.max))return null;
    if(!c.allowCarries&&steps.some(s=>['add','subtract'].includes(s.op)&&ProblemEngine.hasCarry(s.left.n,s.right.n,s.op==='subtract')))return null;
    const symbols={add:'+',subtract:'−',multiply:'×',divide:'÷'};
    return {id:uid(),template:`logic:${form}`,topic:'Lógica · '+['Series de sumas','Cantidad oculta','Orden en una fila','Series multiplicativas','Proceso inverso','Reglas alternas'][form],grade:c.grade,theme:c.theme,statement:text,answer:AdvancedBank.format(answer),unit:'',exactAnswer:answer,contents:['logic'],operations:[],mathematicalModel:{numeric:'rational',tree,steps,answer},steps:[...steps.map(s=>`${AdvancedBank.format(s.left)} ${symbols[s.op]} ${AdvancedBank.format(s.right)} = ${AdvancedBank.format(s.result)}`),explanation],hint:explanation,createdAt:new Date().toISOString(),favorite:false};
  }
  window.generate=function(c){
    if(c.operations.length!==1||c.operations[0]!=='logic')return previous(c);
    const result=[],seen=new Set();for(let i=0;i<5000&&result.length<c.quantity;i++){const p=build(c,i);if(p&&!seen.has(p.statement)){result.push(p);seen.add(p.statement)}}
    if(result.length<c.quantity)throw Error('Los filtros de lógica son demasiado restrictivos. Permite llevadas o reduce la cantidad.');return result;
  };
  window.LogicBank={build};
})();
