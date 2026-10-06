/* Tareas de razonamiento construidas a partir de un modelo resuelto. */
(() => {
  const originalGenerate=window.generate;
  const labels=['Detectar un error','Elegir y justificar','Comprobar con una representación','Planificar una estrategia'];
  function reasoning(p,index,c){
    const level=gradeLevel(c.grade),rank=getLearningProfile(c).rank;
    const mode=level<2?index%3:index%4;
    const raw=p.mathematicalModel?.answer??p.answer;
    const value=raw&&typeof raw==='object'?raw.n/raw.d:Number(raw);
    const correct=raw&&typeof raw==='object'?AdvancedBank.format(raw):fmt(value);
    const statement=p.statement;
    const change=mode===0&&Number.isFinite(Number(value))?Number(value)+1+index%3:null;
    let task,explanation;
    const wrong=raw&&typeof raw==='object'?AdvancedBank.format(AdvancedBank.operate(raw,'add',AdvancedBank.rational(1+index%3))):fmt(change??value+2);
    if(change!==null){task=`Una persona propone ${wrong} como resultado. ¿Es correcto? Encuentra el error y justifica tu respuesta.`;explanation=`La propuesta ${wrong} es incorrecta. El resultado calculado con los datos es ${correct}.`;}
    else if(mode===1&&Number.isFinite(value)){const candidates=index%2?`${wrong} y ${correct}`:`${correct} y ${wrong}`;task=`Se han propuesto dos resultados: ${candidates}. ¿Cuál es correcto? Explica por qué el otro no sirve.`;explanation=`El resultado correcto es ${correct}. Comprueba cada paso y las unidades.`;}
    else if(mode===2){task=level<3?'Resuelve el problema con un dibujo o agrupando objetos. Explica cómo tu representación demuestra la respuesta.':'Representa las relaciones entre las cantidades con un esquema. Resuelve y comprueba que el resultado responde a la pregunta.';explanation='La representación debe conservar las cantidades y las relaciones del enunciado.';}
    else{task=rank<2?'Antes de calcular, explica qué datos necesitas y en qué orden los utilizarías. Después resuelve y comprueba tu plan.':'Propón un plan de resolución. Justifica el orden de los cálculos y explica cómo comprobarías la respuesta sin repetir exactamente el mismo procedimiento.';explanation='El plan debe respetar las dependencias entre cantidades; se aceptan estrategias equivalentes.';}
    if(level<2){
      if(mode===0&&change!==null)task=`Eva dice que son ${wrong}. ¿Tiene razón? Explica.`;
      else if(mode===1&&Number.isFinite(value))task=`¿Qué respuesta es correcta: ${index%2?wrong+' o '+correct:correct+' o '+wrong}? Explica.`;
      else task='Haz un dibujo para comprobar tu respuesta.';
    }
    p.statement=`${statement} ${task}`;
    p.topic=`Razonamiento · ${labels[mode]}`;
    p.reasoning={mode:labels[mode],proposedAnswer:change,rubric:['Utiliza todos los datos necesarios.','Mantiene las unidades y relaciones.','Justifica la estrategia o la corrección.']};
    p.steps=[...p.steps,explanation];p.hint=mode===0?'No aceptes el resultado propuesto sin comprobar las relaciones entre los datos.':'Identifica primero qué representa cada cantidad.';
    return p;
  }
  function grammar(text){
    const singular={'libros':'libro','cuadernos':'cuaderno','semillas':'semilla','plantones':'plantón','botellas de agua':'botella de agua','manzanas':'manzana','bocadillos':'bocadillo','folletos':'folleto','barritas de cereales':'barrita de cereales','toallas':'toalla','mapas':'mapa','tubos de ensayo':'tubo de ensayo','pinceles':'pincel','partituras':'partitura','piezas de construcción':'pieza de construcción','porciones de alimento':'porción de alimento','latas de comida':'lata de comida','bulbos':'bulbo','tapones':'tapón','gorros de natación':'gorro de natación','dorsales':'dorsal','pelotas de tenis':'pelota de tenis','pulseras de acceso':'pulsera de acceso','magdalenas':'magdalena','tornillos':'tornillo','naranjas':'naranja','tarjetas':'tarjeta','cajas':'caja','paquetes':'paquete','bandejas':'bandeja','carpetas':'carpeta','bolsas':'bolsa','estuches':'estuche','botes':'bote','equipos':'equipo','sobres':'sobre'};
    let result=text;for(const [plural,single] of Object.entries(singular))result=result.replace(new RegExp(`\\b1 ${plural}(?=[.,;?\\s]|$)`,'g'),`1 ${single}`);
    return result.replace(/Se reservan 1 /g,'Se reserva 1 ').replace(/Se apartan 1 /g,'Se aparta 1 ').replace(/Se utilizan 1 /g,'Se utiliza 1 ').replace(/Se venden 1 /g,'Se vende 1 ').replace(/Se entregan 1 /g,'Se entrega 1 ').replace(/Se plantan 1 /g,'Se planta 1 ').replace(/Se retiran 1 /g,'Se retira 1 ').replace(/se apartan 1 /g,'se aparta 1 ').replace(/se habían entregado 1 /g,'se había entregado 1 ').replace(/se habían recibido 1 /g,'se había recibido 1 ');
  }
  function simple(text){return text.replace(/aportaciones/gi,'cantidades que han traído').replace(/aporta cada uno/gi,'trae cada uno').replace(/aportan cada uno/gi,'traen cada uno').replace(/aporta/gi,'trae').replace(/donaciones/gi,'regalos').replace(/dona/gi,'regala').replace(/las existencias anteriores/gi,'lo que ya había').replace(/existencias anteriores/gi,'cantidad que ya había').replace(/esas existencias/gi,'esa cantidad').replace(/las existencias disponibles/gi,'la cantidad disponible').replace(/existencias disponibles/gi,'cantidad disponible').replace(/El inventario de (.*?) registra /g,'En $1 hay ').replace(/semilleros/gi,'macetas').replace(/para reponer árboles dañados/gi,'para sustituir árboles rotos').replace(/sin asignar/gi,'sin entregar').replace(/se asignan/gi,'se entregan').replace(/plantea/gi,'propone').replace(/Justifica/g,'Explica').replace(/justifica/g,'explica').replace(/la próxima jornada/gi,'el día siguiente').replace(/la jornada/gi,'el día').replace(/envío adicional/gi,'nuevo envío').replace(/se distribuyen/gi,'se reparten').replace(/distribuye/gi,'reparte').replace(/lotes/gi,'paquetes');}
  window.generate=function(c){const batch=originalGenerate(c);return batch.map((p,index)=>{p.statement=simple(grammar(p.statement));if(c.type==='challenge'||c.difficulty==='challenge'||c.type==='mix'&&index%2===1)reasoning(p,index,c);p.statement=simple(p.statement);return p})};
  window.ProblemText={simple,grammar};
})();
