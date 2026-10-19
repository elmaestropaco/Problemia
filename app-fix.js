/* Interfaz y exportación. El generador se mantiene en problem-engine.js. */
(() => {
  const readingDefaults={font:'print',size:'normal',rate:.9,contrast:false};
  state.data.reading={...readingDefaults,...state.data.reading};
  function applyReading(){const p=state.data.reading;document.body.classList.toggle('font-school',p.font==='school');document.body.classList.toggle('reading-large',p.size==='large');document.body.classList.toggle('high-contrast',p.contrast);document.getElementById('readingFont').value=p.font;document.getElementById('readingSize').value=p.size;document.getElementById('readingRate').value=String(p.rate);document.getElementById('highContrast').checked=p.contrast;}
  applyReading();
  document.getElementById('readProblem')?.remove();
  document.getElementById('mobileMenuButton').addEventListener('click',event=>{const open=document.querySelector('.sidebar').classList.toggle('menu-open');event.currentTarget.setAttribute('aria-expanded',String(open));});
  document.addEventListener('click',event=>{if(event.target.closest('.sidebar button')){document.querySelector('.sidebar').classList.remove('menu-open');document.getElementById('mobileMenuButton').setAttribute('aria-expanded','false')}});
  for(const id of ['settingsButton','mobileSettingsButton'])document.getElementById(id).addEventListener('click',()=>document.getElementById('settingsDialog').showModal());
  document.getElementById('closeSettings').addEventListener('click',()=>document.getElementById('settingsDialog').close());
  document.getElementById('settingsForm').addEventListener('change',()=>{state.data.reading={font:document.getElementById('readingFont').value,size:document.getElementById('readingSize').value,rate:Number(document.getElementById('readingRate').value),contrast:document.getElementById('highContrast').checked};applyReading();persist()});
  const saved = state.data.preferences || state.data.lastConfig;
  const fields={grade:'grade',difficulty:'difficulty',quantity:'quantity',theme:'theme',type:'problemType',operationMode:'operationMode',textLength:'textLength',divisionMode:'divisionMode',allowCarries:'allowCarries',allowNegative:'allowNegative',balanced:'balanced'};
  if(saved){for(const [key,id] of Object.entries(fields)){const el=document.getElementById(id);if(el&&saved[key]!==undefined){if(el.type==='checkbox')el.checked=saved[key];else el.value=String(saved[key]);}}if(saved.operations)document.querySelectorAll('#operations input').forEach(el=>{el.checked=saved.operations.includes(el.value);el.parentElement.classList.toggle('checked',el.checked)});}
  document.getElementById('generatorForm').addEventListener('change',()=>{state.data.preferences=config();persist()});
  const originalShowView=showView;
  window.showView=function(view){originalShowView(view);if(history.state?.view!==view)history.pushState({view},'',`#${view}`)};
  history.replaceState({view:state.currentView},'',location.href);
  window.addEventListener('popstate',event=>originalShowView(event.state?.view||'home'));
  document.addEventListener('click',event=>{const button=event.target.closest('[data-delete-material]');if(button&&confirm('¿Borrar este material?')){state.data.materials=state.data.materials.filter(m=>m.id!==button.dataset.deleteMaterial);persist();renderLibrary();toast('Material eliminado')}});
  new MutationObserver(()=>document.querySelectorAll('#libraryList .library-item').forEach(item=>{const id=item.querySelector('[data-open-material]')?.dataset.openMaterial;if(id&&!item.querySelector('[data-delete-material]')){const button=document.createElement('button');button.className='mini-button danger-button';button.dataset.deleteMaterial=id;button.textContent='Borrar';item.append(button)}})).observe(document.getElementById('libraryList'),{childList:true});
  window.makePDF=function(answers=false){
    if(!window.jspdf?.jsPDF){toast('No se ha cargado el módulo PDF. Puedes usar Imprimir.');return}
    if(!state.problems.length){toast('Genera problemas primero.');return}
    if(state.problems.some(p=>p.validation==='needs-review')){toast('Revisa la solución de los problemas editados antes de exportar.');return}
    const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'}),bottom=280,width=170;
    doc.setProperties({title:answers?'Problemia · Solucionario':'Problemia · Ficha',author:'Francisco Serrano Jiménez - El Maestro Paco',creator:'Problemia'});
    doc.addFileToVFS('Borel-Regular.ttf',ProblemiaFonts.Borel);doc.addFont('Borel-Regular.ttf','Borel','normal');
    doc.addFileToVFS('NotoNaskhArabic-Regular.ttf',ProblemiaFonts.Arabic);doc.addFont('NotoNaskhArabic-Regular.ttf','Arabic','normal');
    let y=38,font='helvetica';
    function header(){doc.setFillColor(36,107,91);doc.roundedRect(14,12,182,17,3,3,'F');doc.setFont('helvetica','bold');doc.setFontSize(16);doc.setTextColor(255);doc.text(answers?'Problemia · Solucionario':'Problemia · Ficha de problemas',20,23);doc.setTextColor(23,36,59);y=38;}
    function page(){doc.addPage();header()}
    function wrap(text,size=12){doc.setFont(font,'normal');doc.setFontSize(size);return doc.splitTextToSize(String(text).replace(/−/g,'-'),width)}
    header();doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text(grades[state.data.lastConfig?.grade]||'Matemáticas',20,y);y+=9;
    if(!answers){doc.text('Nombre: __________________________   Grupo: _________',20,y);y+=10;}
    state.problems.forEach((p,index)=>{
      font=p.language==='ar'?'Arabic':state.data.reading.font==='school'?'Borel':'helvetica';
      const row=font==='Borel'?9:font==='Arabic'?7:5.6;
      const lines=wrap(`${index+1}. ${p.statement}`,12),height=lines.length*row+14;
      const expression=window.ProblemRepresentation?.expression(p);
      const solution=answers?[...(expression?[`Cálculo combinado: ${expression}`]:[]),...p.steps.map(s=>String(s)),`Respuesta: ${p.answer}${p.unit?' '+p.unit:''}`]:[];
      const solutionHeight=solution.reduce((sum,line)=>sum+wrap(line,11).length*row+5,0);
      if(height<=bottom-38&&y+height+(answers?Math.min(solutionHeight,30):57)>bottom)page();
      let pending=[...lines];
      while(pending.length){
        const capacity=Math.max(1,Math.floor((bottom-y-14)/row)),chunk=pending.splice(0,capacity),chunkHeight=chunk.length*row+14;
        doc.setFillColor(242,248,245);doc.roundedRect(14,y,182,chunkHeight,3,3,'F');doc.setTextColor(23,36,59);doc.setFont(font,'normal');doc.setFontSize(12);doc.setLineHeightFactor(row*72/25.4/12);doc.text(chunk,font==='Arabic'?190:20,y+9,{align:font==='Arabic'?'right':'left',isInputRtl:font==='Arabic'});y+=chunkHeight+5;
        if(pending.length)page();
      }
      if(answers){for(const step of solution){const pending=wrap(step,11);while(pending.length){if(y+row+5>bottom)page();const capacity=Math.max(1,Math.floor((bottom-y-5)/row)),chunk=pending.splice(0,capacity);doc.setTextColor(23,36,59);doc.setFont(font,'normal');doc.setFontSize(11);doc.setLineHeightFactor(row*72/25.4/11);doc.text(chunk,20,y+5);y+=chunk.length*row+5;if(pending.length)page();}}y+=8;}
      else{if(y+57>bottom)page();for(const [label,x,w] of [['Datos',14,50],['Operaciones',68,78],['Solución',150,46]]){doc.setDrawColor(145,163,154);doc.setLineWidth(.3);doc.roundedRect(x,y,w,48,2,2,'S');doc.setFontSize(10);doc.setTextColor(36,107,91);doc.text(label,x+4,y+7);}y+=57;}
    });
    for(let pageNumber=1;pageNumber<=doc.getNumberOfPages();pageNumber++){doc.setPage(pageNumber);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(90);doc.text('© 2026 Francisco Serrano Jiménez - El Maestro Paco',14,291);doc.link(14,286,145,7,{url:'https://sites.google.com/view/elmaestropaco/inicio'});doc.text(String(pageNumber),196,291,{align:'right'});}
    doc.save(`Problemia_${answers?'solucionario':'ficha'}.pdf`);
  };
  let speaking=null;
  window.speakBoardStatement=function(){
    const el=document.getElementById('boardStatement'),text=el.textContent;
    if(speaking)speechSynthesis.cancel();el.replaceChildren();const words=[];let offset=0;
    for(const part of text.split(/(\s+)/)){if(!part)continue;if(/^\s+$/.test(part))el.append(document.createTextNode(part));else{const span=document.createElement('span');span.textContent=part;span.dataset.start=offset;span.dataset.end=offset+part.length;el.append(span);words.push(span)}offset+=part.length;}
    speaking=new SpeechSynthesisUtterance(text);speaking.lang=({es:'es-ES',en:'en-GB',fr:'fr-FR',ar:'ar-SA'})[el.lang]||'es-ES';speaking.rate=state.data.reading.rate;
    speaking.onboundary=e=>{if(e.name==='sentence')return;const index=words.findIndex(s=>Number(s.dataset.end)>e.charIndex);words.forEach((s,i)=>s.classList.toggle('speaking',i===index));};
    speaking.onend=speaking.onerror=()=>{words.forEach(s=>s.classList.remove('speaking'));speaking=null};speechSynthesis.speak(speaking);
  };
})();
