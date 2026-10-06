/* Presets orientativos. Las operaciones elegidas nunca se añaden por dificultad. */
(() => {
  const profiles={
    P1:{limits:[10,20,20,20],steps:[1,1,2,2],factor:5,recommended:['add','subtract']},
    P2:{limits:[30,60,100,100],steps:[1,2,2,3],factor:10,recommended:['add','subtract','multiply']},
    P3:{limits:[100,500,1000,1000],steps:[1,2,3,3],factor:10,recommended:['add','subtract','multiply','divide']},
    P4:{limits:[300,1500,5000,5000],steps:[1,2,3,4],factor:12,recommended:['add','subtract','multiply','divide','decimal','measure']},
    P5:{limits:[500,3000,10000,10000],steps:[2,3,4,4],factor:15,recommended:['add','subtract','multiply','divide','decimal','measure','fraction','geometry']},
    P6:{limits:[1000,5000,20000,20000],steps:[2,3,4,5],factor:20,recommended:['add','subtract','multiply','divide','decimal','measure','fraction','geometry','percent','proportion','divisibility']},
    E1:{limits:[1000,5000,20000,30000],steps:[2,3,4,5],factor:25,recommended:['add','subtract','multiply','divide','decimal','measure','fraction','geometry','percent','proportion','divisibility','power','equation']},
    E2:{limits:[2000,10000,50000,100000],steps:[2,3,4,5],factor:30,recommended:['add','subtract','multiply','divide','decimal','measure','fraction','geometry','percent','proportion','divisibility','power','equation']}
  };
  profiles.E1.recommended.push('root');profiles.E2.recommended.push('root');
  window.getLearningProfile=c=>{
    const p=profiles[c.grade]||profiles.P3,rank={easy:0,medium:1,hard:2,challenge:3}[c.difficulty]??1;
    const arithmetic=c.operations.filter(op=>['add','subtract','multiply','divide'].includes(op));
    return {...p,rank,max:p.limits[rank],targetSteps:Math.max(arithmetic.length,p.steps[rank]),custom:c.operations.some(op=>op!=='logic'&&!p.recommended.includes(op))||(c.allowNegative&&['P1','P2','P3','P4','P5','P6'].includes(c.grade))};
  };
  const tip=document.createElement('p');tip.id='profileExplanation';tip.className='profile-explanation';document.getElementById('difficulty').closest('.field-row').after(tip);
  function update(){const c=config(),p=getLearningProfile(c);tip.textContent=`${p.custom?'Configuración personalizada. ':''}Referencia: cantidades hasta ${p.max.toLocaleString('es-ES')} y unos ${p.targetSteps} pasos. ${c.type==='challenge'?'Se pedirá justificar, comprobar o reconstruir la solución.':'Las operaciones son las que has marcado.'}`;}
  document.getElementById('generatorForm').addEventListener('change',update);update();
})();
