/* Edición docente e importación aditiva de copias locales. */
(() => {
  $('#exportData').insertAdjacentHTML('afterend','<button class="button secondary" id="importData">Importar copia</button><input type="file" id="backupFile" accept="application/json,.json" hidden><button class="button secondary" id="addManualProblem">Añadir problema propio</button>');
  document.body.insertAdjacentHTML('beforeend','<dialog id="editDialog" aria-labelledby="editTitle"><button class="dialog-close" id="closeEditor" aria-label="Cerrar editor">×</button><h2 id="editTitle">Editar problema</h2><form id="editForm" class="editor-fields"><label>Enunciado<textarea id="editStatement" maxlength="1800" required></textarea></label><label>Solución revisada por el docente<input type="text" id="editAnswer" maxlength="500" required></label><label>Pasos de resolución<textarea id="editSteps" maxlength="3000"></textarea></label><label class="settings-check"><input type="checkbox" id="manualReviewed"> He comprobado que los datos y la solución son correctos</label><p class="dialog-note">Al cambiar el texto, la solución deja de estar validada automáticamente. Puedes guardar un borrador; para exportarlo debes revisar la solución.</p><button class="button primary" type="submit">Guardar cambios</button></form></dialog>');
  let editing=null;
  function openEditor(p){editing=p;$('#editStatement').value=p?.originalStatement||p?.statement||'';const unit=p?.originalUnit??p?.unit;$('#editAnswer').value=p?`${p.answer}${unit?' '+unit:''}`:'';$('#editSteps').value=(p?.originalSteps??p?.steps)?.join('\n')||'';$('#manualReviewed').checked=false;$('#editDialog').showModal();}
  document.addEventListener('click',event=>{const button=event.target.closest('[data-edit]');if(button)openEditor(state.problems.find(p=>p.id===button.dataset.edit))});
  $('#closeEditor').addEventListener('click',()=>$('#editDialog').close());
  $('#addManualProblem').addEventListener('click',()=>openEditor(null));
  $('#editForm').addEventListener('submit',event=>{
    event.preventDefault();const p=editing||{id:uid(),grade:$('#grade').value,topic:'Problema propio',template:'manual',createdAt:new Date().toISOString()};
    p.statement=cleanSpanish($('#editStatement').value);p.answer=$('#editAnswer').value.trim();p.unit='';p.steps=$('#editSteps').value.split('\n').filter(s=>s.trim());p.validation=$('#manualReviewed').checked?'manual-reviewed':'needs-review';p.language='es';p.hint='Revisa los datos del problema.';
    delete p.originalStatement;delete p.originalSteps;delete p.localizations;delete p.mathematicalModel;delete p.exactAnswer;delete p.verifiedOperations;
    if(!editing){state.problems.push(p);state.data.materials.push({id:uid(),type:'worksheet',title:'Problema propio',grade:p.grade,problems:[structuredClone(p)],createdAt:p.createdAt});}
    for(const m of state.data.materials){const index=m.problems.findIndex(item=>item.id===p.id);if(index>=0)m.problems[index]=structuredClone(p);}
    persist();$('#editDialog').close();renderResults();toast(p.validation==='needs-review'?'Borrador guardado: falta revisar la solución.':'Problema revisado y guardado.');
  });
  function validProblem(p){return p&&typeof p.id==='string'&&/^[\w.:-]{1,199}$/.test(p.id)&&typeof p.statement==='string'&&p.statement.length<=10000&&['string','number'].includes(typeof p.answer)&&Array.isArray(p.steps)&&p.steps.length<200&&p.steps.every(s=>typeof s==='string');}
  function validateBackup(parsed){
    if(parsed.schema&&parsed.schema!=='problemia-backup')throw Error('No es una copia de Problemia.');if(parsed.version&&![1,2].includes(parsed.version))throw Error('Versión de copia no compatible.');
    const data=parsed.data||parsed;if(!Array.isArray(data.materials)||data.materials.length>2000)throw Error('La lista de materiales no es válida.');
    for(const m of data.materials)if(!m||typeof m.id!=='string'||typeof m.title!=='string'||!Array.isArray(m.problems)||m.problems.length>1000||!m.problems.every(validProblem))throw Error('Hay un material con datos incompletos. No se ha importado nada.');
    if(data.strokeStore){if(typeof data.strokeStore!=='object'||Array.isArray(data.strokeStore))throw Error('Las anotaciones no son válidas.');for(const strokes of Object.values(data.strokeStore)){if(!Array.isArray(strokes)||strokes.length>100000||strokes.some(s=>!s||!Array.isArray(s.points)||!s.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))))throw Error('Los trazos no son válidos.');}}
    return data;
  }
  function mergeBackup(data){const existing=new Set(state.data.materials.map(m=>m.id));let added=0;for(const m of data.materials)if(!existing.has(m.id)){state.data.materials.push(structuredClone(m));existing.add(m.id);added++;}
    for(const [key,value] of Object.entries(data.strokeStore||{}))if(!['__proto__','prototype','constructor'].includes(key)&&!Object.hasOwn(state.strokes,key))state.strokes[key]=structuredClone(value);
    state.data.strokeStore=state.strokes;persist();renderLibrary();renderRecent();return added;
  }
  $('#importData').addEventListener('click',()=>$('#backupFile').click());
  $('#backupFile').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>30*1024*1024)throw Error('La copia supera el tamaño permitido de 30 MB.');const data=validateBackup(JSON.parse(await file.text())),fresh=data.materials.filter(m=>!state.data.materials.some(old=>old.id===m.id));if(confirm(`Se añadirán ${fresh.length} materiales. Los materiales con el mismo identificador se conservarán sin cambios. ¿Importar?`)){const count=mergeBackup(data);toast(`${count} materiales importados.`)}}catch(error){toast(error.message)}finally{event.target.value=''}});
  window.Materials={validateBackup,mergeBackup,validProblem};
})();
