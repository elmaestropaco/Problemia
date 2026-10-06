/* Autoría y representación del modelo, sin mostrar la respuesta en la ficha. */
(() => {
  const author='Francisco Serrano Jiménez - El Maestro Paco';
  const url='https://sites.google.com/view/elmaestropaco/inicio';
  const credit=document.createElement('p');credit.className='author-credit';
  credit.append(document.createTextNode('© 2026 '));const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=author;credit.append(link);document.querySelector('.sidebar').append(credit);
  const symbols={add:'+',subtract:'−',multiply:'×',divide:'÷'};
  function expression(p){
    const model=p.mathematicalModel;if(!model)return '';
    const semantic=model.semantic?`${model.semantic.kind==='root'?`raíz ${model.semantic.degree===3?'cúbica':'cuadrada'}`:model.semantic.kind==='gcd'?'MCD':'MCM'}(${model.semantic.values.join(', ')})`:'';
    const number=v=>v&&typeof v==='object'?AdvancedBank.format(v):fmt(v);
    const visit=t=>{if(t.kind==='value')return semantic&&['gcd','lcm','root'].includes(t.label)?semantic:number(t.value);const text=`(${visit(t.left)} ${symbols[t.op]} ${visit(t.right)})`;return t.op==='divide'&&model.numeric!=='rational'&&StoryBank.solve(t.left,[])%StoryBank.solve(t.right,[])?`parte entera de ${text}`:text;};
    if(model.tree)return visit(model.tree);
    let text=number(model.initial);for(const step of model.steps||[]){text=`(${text} ${symbols[step.op]} ${number(step.right)})`;if(step.op==='divide'&&step.remainder)text=`parte entera de ${text}`;}return text;
  }
  window.ProblemRepresentation={expression,author,url};
  const division=document.getElementById('divisionMode');division.parentElement.firstChild.textContent='Divisiones enteras ';division.title='Este filtro se aplica a los problemas aritméticos con cociente y resto. Los contenidos especializados usan fracciones exactas.';
  function annotate(){document.querySelectorAll('.problem-card').forEach(card=>{const p=state.problems.find(p=>p.id===card.dataset.id),solution=card.querySelector('.solution');if(!p||!solution||solution.querySelector('.combined-expression'))return;const text=expression(p);if(text){const el=document.createElement('p');el.className='combined-expression';el.textContent=`Cálculo combinado: ${text}`;solution.prepend(el)}})}
  new MutationObserver(annotate).observe(document.getElementById('problemList'),{childList:true});annotate();
  document.getElementById('showHint').addEventListener('click',()=>{const text=expression(state.problems[state.boardIndex]||{});if(text){const el=document.createElement('p');el.textContent=`Representación de las relaciones: ${text}`;document.getElementById('hintPanel').append(el)}});
  document.getElementById('printWorksheet').addEventListener('click',event=>{if(state.problems.some(p=>p.validation==='needs-review')){event.stopImmediatePropagation();toast('Revisa las soluciones editadas antes de imprimir.')}},true);
})();
