/* La selección es una obligación por problema o un conjunto de opciones para la ficha. */
(() => {
  const previous=window.generate;
  const principals=new Set(['measure','geometry','proportion','divisibility','power','root','equation']);
  function evidence(p){
    const found=new Set((p.mathematicalModel?.steps||[]).map(step=>step.op));
    function visit(node){if(!node)return;for(const content of node.contents||[])found.add(content);if(node.kind==='operation'){visit(node.left);visit(node.right)}}
    visit(p.mathematicalModel?.tree);return found;
  }
  function verify(p,required){
    const found=evidence(p),missing=required.filter(option=>!found.has(option));
    if(missing.length)throw Error('El problema no incorpora todas las opciones solicitadas: '+missing.join(', ')+'. Cambia la combinación o los filtros.');
    return {...p,selectionOperations:[...required],verifiedOperations:required.filter(option=>found.has(option))};
  }
  const shuffle=(items,rng)=>{const out=[...items];for(let i=out.length-1;i>0;i--){const j=rand(rng,0,i);[out[i],out[j]]=[out[j],out[i]]}return out};
  function update(){document.getElementById('operationModeNote').textContent=document.getElementById('operationMode').value==='mixed'?'Lo marcado es el repertorio de la ficha: habrá problemas con una operación y otros con varias. Los temas principales se reparten sin forzar mezclas incompatibles. Si pides menos problemas que opciones marcadas, pueden no aparecer todas.':'Cada problema incluirá todas las operaciones y contenidos marcados que sean compatibles.';}
  document.getElementById('operationMode').addEventListener('change',update);update();
  window.generate=function(c){
    if(c.operationMode!=='mixed')return previous(c).map(p=>({...verify(p,c.operations),allowedOperations:[...c.operations],generationMode:'all'}));
    const options=[...new Set(c.operations)];if(!options.length)throw Error('Selecciona al menos una operación o contenido.');
    const rng=seeded(`${c.seed}-plan`),anchors=shuffle(options,rng),result=[],seen=new Set(),covered=new Set(),cap=[2,3,5,5][getLearningProfile(c).rank];
    for(let slot=0;slot<c.quantity;slot++){
      const pending=anchors.filter(option=>!covered.has(option));
      const anchor=pending[0]||(c.balanced===false?anchors[rand(rng,0,anchors.length-1)]:anchors[slot%anchors.length]);let chosen=null,lastError=null;
      for(let attempt=0;attempt<20&&!chosen;attempt++){
        const pattern=[1,2,1,3,2,4,5],size=Math.min(options.length,cap,attempt>12?1:pattern[slot%pattern.length]);
        const subset=[anchor];
        for(const candidate of shuffle(options.filter(x=>x!==anchor),rng)){
          if(subset.length>=size)break;
          if(principals.has(candidate)&&subset.some(x=>principals.has(x)))continue;
          subset.push(candidate);
        }
        const single={...c,operationMode:'all',operations:subset,quantity:1,type:c.type==='mix'?(slot%2?'challenge':'context'):c.type,variantOffset:slot,reasoningOffset:slot,seed:`${c.seed}-slot-${slot}-${attempt}`};
        try{const p=previous(single)[0];if(!p)continue;if(seen.has(p.statement))continue;chosen={...verify(p,subset),allowedOperations:options,generationMode:'mixed'};}catch(error){lastError=error;}
      }
      if(!chosen)throw Error(`No se puede generar el problema ${slot+1} con estos filtros${lastError?': '+lastError.message:'. Prueba a permitir llevadas o cambia la dificultad.'}`);
      result.push(chosen);seen.add(chosen.statement);chosen.verifiedOperations.forEach(option=>covered.add(option));
    }
    if(c.quantity>=options.length&&options.some(option=>!covered.has(option)))throw Error('No se han podido trabajar todas las opciones de la ficha. Revisa los filtros.');return result;
  };
  window.GenerationPlanner={principals,evidence,verify};
})();
