## Prompt inicial para Vibecode

Construye una aplicación educativa llamada provisionalmente AulaReto, en español de España, destinada al docente para generar, proyectar, resolver a mano y exportar problemas matemáticos desde 1.º de Primaria hasta 2.º de ESO. Sigue todos los requisitos de este documento.

La prioridad de uso es una pizarra digital desde un navegador en ordenador, en formato horizontal, con entrada táctil, ratón y lápiz. También debe funcionar en tablet y móvil con una disposición adaptada. Antes de elegir arquitectura, comprueba si el proyecto permite una versión web con escritura y descarga de PDF. Si la base del proyecto es exclusivamente nativa, identifica esta limitación y ofrece una implementación web compatible; no declares que una app móvil sirve en una pizarra por el mero hecho de poder proyectarla.

Implementa una aplicación funcional con generador matemático determinista, banco de plantillas propio y persistencia local. No requiere cuentas de alumnado ni servicios de pago para generar problemas. La IA será una ampliación opcional para variar textos y nunca la autoridad que calcula soluciones.

Incluye selección de curso, contenido, dificultad, nivel lector, operaciones, temas, cantidad y opciones numéricas; vista previa editable; lotes; modo pizarra con un problema por pantalla y áreas manuscritas de Datos, Operaciones y Solución; pistas y solución progresiva; favoritos; historial; banco editable; PDF real para alumnado y solucionario independiente.

Diseño atractivo, legible, tranquilo y apropiado para Primaria y ESO, sin apariencia de juego infantil para todos los cursos. Proporciona contenido inicial real. Construye por las fases al final del documento y verifica los criterios de aceptación. Nunca uses datos de ejemplo como sustituto de un banco funcional, soluciones fijas, generación aleatoria sin restricciones o capturas de pantalla como único sistema de PDF.

## 1. Propósito y límites

El docente debe poder crear material útil en menos de un minuto, resolverlo en clase y reutilizarlo. El producto combina tres usos:

1. Problema del día: generar uno y trabajar en la pizarra.
2. Sesión de problemas: generar un lote y recorrerlo de uno en uno.
3. Ficha: descargar un PDF de uno o varios problemas con espacio para escribir, y un solucionario aparte.

No se necesita inicialmente corrección de escritura manuscrita, OCR, registro de alumnado, notas, clasificación competitiva ni sincronización entre dispositivos. Las anotaciones son trabajo de aula: se conservan, pero no se interpreta automáticamente si son correctas.

## 2. Niveles y contenidos

Los cursos son presets orientativos editables, no una certificación de alineación con un currículo concreto. No etiquetar como «alineado con normativa» sin realizar una revisión curricular específica. La dificultad se define dentro de cada curso.

| Curso | Preset inicial orientativo | Complejidad inicial |
|---|---|---|
| 1.º Primaria | Naturales hasta 20; sumas y restas sin resultados negativos | Una pregunta, un paso y frases cortas |
| 2.º Primaria | Naturales hasta 100; sumas y restas; agrupaciones y tablas iniciales | Uno o dos pasos sencillos |
| 3.º Primaria | Hasta 1.000; cuatro operaciones; división exacta y resto sencillo | Uno o dos pasos |
| 4.º Primaria | Naturales mayores; cuatro operaciones; medidas, dinero y decimales sencillos | Dos pasos y conversiones básicas |
| 5.º Primaria | Decimales; fracciones sencillas; medidas, perímetro y área | Dos o tres pasos |
| 6.º Primaria | Fracciones; porcentajes sencillos; proporcionalidad directa; problemas mixtos | Dos a cuatro pasos |
| 1.º ESO | Naturales, enteros, decimales, fracciones, divisibilidad y proporcionalidad | Varios pasos, representación y razonamiento |
| 2.º ESO | Proporcionalidad directa e inversa; porcentajes; potencias; ecuaciones sencillas; geometría | Varios pasos y justificación |

Cada preset puede modificarse. Las incompatibilidades se explican: si se selecciona un curso y se habilitan contenidos avanzados, indicar «Configuración personalizada» y permitirlo expresamente.

Separar cinco dimensiones de dificultad:

- Tamaño y tipo de números.
- Número de pasos.
- Complejidad del razonamiento.
- Complejidad del texto.
- Ayuda visible.

Ofrecer Fácil, Medio, Difícil y Reto. Un problema con números pequeños puede requerir mucho razonamiento. El nivel Reto no debe limitarse a aumentar los números.

Contenidos seleccionables:

- Sumas y restas con y sin llevadas/préstamos, según configuración.
- Multiplicación; tablas concretas; uno o varios dígitos.
- División exacta, con resto e interpretación contextual del resto.
- Naturales, enteros positivos/negativos, decimales y fracciones.
- Operaciones combinadas y paréntesis.
- Dinero, tiempo, longitud, masa y capacidad.
- Comparación, diferencias, reparto, agrupación e incógnitas.
- Porcentajes, descuentos y aumentos.
- Proporcionalidad directa e inversa.
- Múltiplos, divisores, MCD y MCM en contextos apropiados.
- Perímetro, área y, como ampliación, volumen.
- Potencias y ecuaciones de primer grado sencillas.
- Retos de patrones, lógica, estimación, errores, datos innecesarios y elección de estrategias.

Las operaciones marcadas significan «operaciones permitidas». Añadir un interruptor «Incluir todas las seleccionadas»: por problema cuando sea viable, o en el conjunto del lote. Explicar la cobertura y avisar si la cantidad o los pasos no permiten cumplirla. No asumir que marcar cuatro operaciones obliga a utilizarlas todas en cada enunciado.

## 3. Pantallas y recorrido principal

### Inicio

Acciones visibles: Crear problema, Crear ficha, Abrir pizarra, Banco de problemas y Mis materiales. Mostrar los últimos materiales guardados y un acceso a continuar sesión.

### Generador

Organizar las opciones en Básicas y Avanzadas.

Básicas:

- Curso y dificultad.
- Tipo: problema contextualizado, reto o mezcla.
- Contenidos y operaciones permitidas.
- Cantidad: 1, 5, 10, 15, 20 o personalizada de 1 a 50.
- Temática: variada o seleccionada.
- Texto: breve, estándar o detallado.
- Botón Generar.

Avanzadas:

- Rango de operandos y rango de resultados, claramente separados.
- Pasos: 1, 2, 3 o 4; adaptados al contenido.
- Decimales: 1, 2 o 3 cifras; sin decimales adicionales accidentales.
- Negativos permitidos; parámetros particulares para enteros.
- Llevadas/préstamos; tablas; límites de factores y divisores.
- División: exacta, con resto, decimal o mixta.
- Datos innecesarios: desactivados inicialmente.
- Incógnita: resultado, dato inicial o dato intermedio.
- Unidades; conversiones permitidas.
- Cobertura del lote: equilibrada o aleatoria.
- Progresión: dificultad constante o creciente.
- Contextos excluidos y temas favoritos.
- Lectura accesible: frases más cortas, un dato por frase y posibilidad de mostrar una pregunta cada vez.

Si no hay plantillas compatibles, dar un mensaje útil con las restricciones en conflicto. No generar un contenido distinto ni relajar requisitos silenciosamente.

### Vista previa del lote

Mostrar los problemas completos, su contenido y dificultad, y la solución oculta por defecto. Permitir:

- Regenerar un solo problema manteniendo el resto.
- Cambiar solo los números, solo el contexto o ambos.
- Reordenar, quitar, duplicar y añadir problemas.
- Guardar ficha, marcar favorito, abrir en pizarra y exportar PDF.
- Editar texto, datos y pregunta; validar antes de guardar.

Al editar números desde campos estructurados, recalcular enunciado y solución juntos. Si se edita libremente el texto y no puede comprobarse su equivalencia con el modelo matemático, marcar «Edición manual pendiente de revisión» y exigir que el docente revise la solución. No conservar una falsa etiqueta de validado.

## 4. Modo pizarra: función central

Mostrar exactamente un problema cada vez. El enunciado va arriba; debajo hay tres espacios claramente identificados:

- Datos: identificar y representar la información.
- Operaciones: zona principal para cálculos, esquemas y dibujos.
- Solución: respuesta final con unidades.

Distribución horizontal inicial: enunciado en el 20–25 % superior; debajo Datos ocupa aproximadamente un cuarto del ancho y Operaciones el resto; Solución ocupa una franja inferior. Añadir una disposición alternativa con las tres zonas verticales y un modo «Lienzo libre». La zona de Operaciones debe poder ampliarse a pantalla casi completa sin perder el enunciado.

En las tres zonas se puede escribir directamente con lápiz táctil, dedo o ratón. Están vacías por defecto: las respuestas correctas no aparecen al abrir el problema.

Herramientas:

- Lápiz, rotulador, borrador por trazo y texto mecanografiado.
- Al menos cuatro colores y tres grosores.
- Deshacer y rehacer por problema.
- Borrar zona o borrar todo; confirmación solo cuando se vaya a perder trabajo.
- Fondo blanco, cuadrícula o pauta; opción de alto contraste.
- Mostrar/ocultar ayudas, pistas y solución.
- Anterior, siguiente y contador «3 de 10».
- Pantalla completa cuando el navegador lo permita.
- Mostrar/ocultar barra; modo compacto; aumentar tamaño del enunciado.
- «Ocultar anotaciones» para volver al enunciado limpio sin borrarlas.

Persistir los trazos por problema y sesión. Cambiar de problema, recargar, entrar o salir de pantalla completa y cambiar la orientación no debe borrarlos ni desplazarlos. Una copia de un problema crea un nuevo espacio de anotación, no una referencia compartida al original.

Detalles imprescindibles de entrada:

- Usar eventos de puntero y captura de puntero en web, o mecanismo equivalente compatible.
- Desactivar el desplazamiento solo sobre los lienzos mientras se escribe; mantener el resto de controles utilizables.
- Diferenciar escribir de desplazar/zoom. No prometer rechazo de palma universal: depende del dispositivo; priorizar stylus cuando se detecte.
- Guardar coordenadas normalizadas o vectoriales y escalar sin deformar al redimensionar.
- Ajustar la resolución visible a la densidad de píxeles, manteniendo el modelo de trazos independiente.
- No disparar botones con un trazo que empieza en un lienzo y termina fuera.
- Guardado local automático con indicador discreto «Guardado» y recuperación tras cierre inesperado.

## 5. Pistas y solución didáctica

El docente controla cada revelación, sin pasar obligatoriamente por todas:

1. Pista 1: qué se pregunta o cómo representar la situación.
2. Pista 2: estrategia u operación inicial, sin resultado final.
3. Datos organizados: relevantes e innecesarios diferenciados.
4. Resolución por pasos: cada paso con explicación y operación.
5. Solución completa: frase, valor y unidad.
6. Comprobación: sustitución, operación inversa o comprobación contextual.

Las ayudas se muestran en un panel o superposición y no ocupan ni sobrescriben los trazos. «Ocultar solución» oculta todos los elementos revelados de respuesta; pasar al siguiente problema empieza con ayudas ocultas. Permitir indicar otras estrategias equivalentes, sin presentar un único método como el único correcto.

Para retos abiertos, ofrecer una rúbrica breve y ejemplos válidos. Distinguirlos de los problemas con respuesta única; no inventar una solución única cuando hay varias.

## 6. Generador fiable

El generador debe tener tres capas separadas:

1. Modelo matemático: estructura, variables, restricciones, operaciones y solución.
2. Plantilla semántica: relación entre cantidades, contexto, unidades y preguntas.
3. Realización lingüística: nombres, objetos, frases y concordancia.

Proceso:

1. Normalizar la configuración y encontrar plantillas compatibles.
2. Seleccionar una estructura que cumpla la cobertura del lote.
3. Generar cantidades compatibles; en divisiones exactas, generar divisor y cociente y derivar dividendo.
4. Resolver con funciones matemáticas del código.
5. Comprobar límites, unidades, precisión, unicidad cuando corresponda y sentido del contexto.
6. Construir el enunciado y las ayudas desde el mismo modelo.
7. Comprobar duplicados y diversidad.
8. Guardar problema, semilla, versión de plantilla y modelo resuelto.

Usar un máximo configurable de intentos; si no se puede generar, explicar la causa y ofrecer ajustar restricciones. Nunca entrar en un bucle infinito o rellenar el lote con duplicados ocultos.

Reglas de coherencia:

- Sin división entre cero.
- Sin cantidades fraccionarias de personas o de objetos indivisibles, salvo que el problema pida interpretar esa imposibilidad.
- Sin existencias negativas al quitar objetos, salvo un contexto explícito de deuda.
- Sin enteros negativos en cursos que no los tienen habilitados.
- Unidades consistentes, con conversiones explícitas y dimensionalmente válidas.
- Precios de dinero con dos decimales como máximo, salvo contexto especial señalado.
- Distinguir coma decimal de separadores de miles; usar formato español y espacio para millares cuando mejore la lectura.
- No trabajar con aritmética binaria de coma flotante sin control: usar enteros escalados para dinero, racionales para fracciones y precisión decimal controlada para otros decimales.
- No redondear pasos intermedios de forma que cambie el resultado. Indicar precisión y criterio cuando se necesite aproximar.
- Diferenciar distancia, tiempo transcurrido y hora del reloj; un cambio de día debe explicitarse.
- Evitar enunciados ambiguos como «tres veces más»; usar «el triple».
- En proporcionalidad inversa, indicar las hipótesis: mismo ritmo de trabajo y misma tarea.
- Cada pregunta tiene los datos necesarios; información insuficiente solo en retos diseñados así.
- El resto se interpreta según la pregunta: 29 personas en vehículos de 8 plazas requieren 4 vehículos; 29 objetos en cajas completas de 8 producen 3 cajas completas y 5 objetos sueltos.
- Distinguir multiplicación y división como proceso de generación de las operaciones que debe hacer el estudiante para responder.

Representar las operaciones mediante un árbol o grafo estructurado; no ejecutar texto con eval. Calcular las soluciones de los retos mediante validadores específicos cuando corresponda.

## 7. Banco amplio y combinable

Objetivo de la primera versión completa: **120 plantillas matemáticas y semánticas distintas**, repartidas en 60 básicas, 40 de varios pasos y 20 de razonamiento. Como punto de partida, el anexo ofrece 60 estructuras; ampliar hasta 120 con nuevas relaciones, preguntas y estrategias, no cambiando solamente nombres o cantidades.

Además, crear al menos 12 familias temáticas con vocabulario suficiente para combinar: aula, biblioteca, supermercado, cocina, deporte, excursiones, animales, huerto, juegos, transporte, ciencia y consumo de agua/energía. Cada familia incluye objetos, unidades, lugares, acciones y vocabulario compatible, sin forzar todos los temas en todas las estructuras.

Para cada plantilla, incluir tres realizaciones lingüísticas revisadas. Un banco de nombres, objetos y frases amplía la variedad, pero sus combinaciones no se contabilizan como nuevas estructuras matemáticas. Mostrar por separado «plantillas» y «variaciones».

Combinar mediante reglas de compatibilidad: persona + acción + objeto + unidad + relación matemática + pregunta. Una receta admite gramos o litros; el número de pasajeros debe ser entero; un descuento usa importes monetarios; una temperatura admite negativos.

Dos plantillas solo pueden combinarse si sus cantidades y unidades encajan. Por ejemplo, compra de varios artículos + pago y cambio. El resultado es un modelo de varios pasos, con un grafo de dependencias y sin preguntas intermedias que revelen automáticamente la estrategia si se ha elegido modo reto.

Diversidad del lote:

- Evitar repeticiones de texto, estructura y números dentro de un mismo lote.
- Limitar apariciones consecutivas del mismo contexto o estructura.
- Mantener identificadores y huellas para detectar duplicados.
- Si el filtro deja pocas plantillas disponibles, informar de la limitación.
- La semilla permite reproducir los mismos problemas; los guardados no se regeneran al abrirlos, aunque cambie el banco.

Editor del banco:

- Buscar por texto y filtrar por curso, operaciones, tipo de número, dificultad y temática.
- Añadir, editar, desactivar y duplicar plantillas.
- Para el docente, formularios guiados para estructuras conocidas; para estructuras nuevas, editor avanzado con esquema y validación.
- Vista previa con varias semillas y aviso de variables sin utilizar, datos ausentes y unidades incompatibles.
- Importar/exportar banco en JSON con versión de esquema; comprobar antes de sobrescribir.
- Los enunciados escritos manualmente pueden guardarse con solución introducida por el docente, identificados como revisados manualmente.

## 8. PDF: ficha, solucionario y sesión resuelta

Generar un archivo PDF auténtico, descargable o compartible según plataforma. El texto del enunciado debe ser seleccionable; solo las anotaciones pueden exportarse como imagen si el motor no permite trazos vectoriales.

Opciones:

- Todo el lote, problemas seleccionados o uno.
- A4 vertical inicial; A4 horizontal opcional.
- Uno, dos o cuatro problemas por página, según longitud y espacio necesario.
- Título, curso opcional, fecha opcional y campos de nombre/grupo vacíos.
- Datos, Operaciones y Solución con cajas blancas, cuadrícula o pauta.
- Versión en color o preparada para blanco y negro.
- Tamaño de letra normal o lectura ampliada.
- Mostrar u ocultar etiquetas de contenido y dificultad.
- Ficha limpia, ficha con anotaciones o solucionario separado.

Un problema puede contener varias preguntas, pero en pizarra sigue siendo una única unidad con sus preguntas claramente numeradas.

Si cuatro problemas no caben con espacio suficiente, reducir automáticamente a dos y avisar en la vista previa. No disminuir la letra hasta hacerla ilegible. Nunca partir el enunciado de un problema entre páginas; si un problema es demasiado largo, darle una página propia.

El solucionario contiene enunciado o referencia inequívoca, datos, pasos, resultado con unidades y comprobación. La exportación del alumnado excluye todas las soluciones, incluso las ocultas en la interfaz. Evitar capas ocultas o metadatos que incorporen respuestas.

Numeración del PDF igual a la del lote visible. Añadir vista previa y nombre de archivo claro, por ejemplo `AulaReto_4Primaria_Decimales_2026-10-06.pdf`. No abrir un diálogo de impresión y afirmar que se ha descargado un PDF si no se ha generado el archivo.

## 9. Aspecto visual y accesibilidad

Paleta orientativa: fondo #F5F7FB, texto #17243B, azul #2563EB, verde oscuro #15803D y naranja oscuro #C2410C. Verificar contraste real de cada combinación, especialmente etiquetas, botones y estados desactivados.

Usar tipografía sans serif clara, tarjetas suaves y espaciado generoso. En pizarra, enunciado aproximadamente de 30–40 px en escritorio, ajustable; controles táctiles de al menos 48 px. No llenar la pantalla con ilustraciones que resten espacio de trabajo.

Datos, Operaciones y Solución pueden identificarse mediante iconos y bandas de color discretas, siempre con texto. Mostrar cantidades con números legibles. Representar fracciones y expresiones matemáticas con un renderizador compatible con web y PDF o un equivalente accesible.

Tema «Aula» con pequeños detalles ilustrados y tema «Sobrio» para alumnado mayor. No cambiar el funcionamiento entre temas.

Navegación por teclado, etiquetas para lectores de pantalla, foco visible y alternativa de texto a las zonas manuscritas. No depender solo del color ni de animaciones; respetar reducción de movimiento. Ofrecer mostrar el enunciado por partes y lectura en voz alta como ampliación si el entorno la admite.

## 10. Guardado y organización

Guardar configuración, problemas generados, fichas, favoritos, sesiones y trazos en persistencia local adecuada al entorno. En web, preferir almacenamiento estructurado con capacidad para trazos y muchos problemas. Informar en Ajustes de que borrar datos del navegador o de la app puede eliminar estos materiales.

Biblioteca local con título editable, curso, fecha, etiquetas y búsqueda. Distinguir:

- Plantilla: reglas para generar problemas.
- Problema: instancia con números y solución fijos.
- Ficha: lista ordenada de problemas.
- Sesión: ficha o problema con anotaciones de pizarra.

Permitir exportar e importar una copia de seguridad en JSON, incluyendo banco personalizado, materiales y trazos. Validar esquema y migraciones. Importar no debe sobrescribir sin mostrar el efecto; detectar identificadores repetidos y permitir crear copia.

No recopilar información personal del alumnado. No hay analíticas externas necesarias para el uso principal. Sincronización y cuentas del docente son ampliaciones, no requisitos para generar ni trabajar en clase.

## 11. Modelo de datos orientativo

Implementar esquemas validados y versionados; adaptar los nombres al lenguaje elegido manteniendo los conceptos.

```ts
type Grade = 'P1'|'P2'|'P3'|'P4'|'P5'|'P6'|'E1'|'E2';
type Difficulty = 'easy'|'medium'|'hard'|'challenge';
type NumericType = 'natural'|'integer'|'decimal'|'fraction';
type Operation = 'add'|'subtract'|'multiply'|'divide';
type Area = 'data'|'operations'|'answer'|'free';

interface ProblemTemplate {
  id: string;
  version: number;
  title: string;
  gradePresets: Grade[];
  topics: string[];
  numericTypes: NumericType[];
  requiredOperations: Operation[];
  structureId: string; // Implementación registrada; nunca código ejecutable importado.
  variableSpecs: Record<string, unknown>;
  constraints: unknown[]; // Esquema declarativo validado.
  textVariants: string[];
  compatibleThemes: string[];
  answerKind: 'unique'|'multiple'|'open'|'insufficient';
  enabled: boolean;
}

interface ProblemInstance {
  id: string;
  templateId: string;
  templateVersion: number;
  seed: string;
  configurationSnapshot: Record<string, unknown>;
  mathematicalModel: Record<string, unknown>;
  statement: string;
  questions: {id: string; text: string}[];
  relevantData: {label: string; value: string; unit?: string}[];
  extraData: {label: string; value: string; unit?: string}[];
  hints: string[];
  steps: {explanation: string; expression: string; result: string}[];
  answers: {questionId: string; exactValue?: string; unit?: string; sentence: string}[];
  check: string;
  rubric?: string[];
  validation: 'automatic'|'manual-reviewed'|'needs-review';
  fingerprint: string;
  createdAt: string;
}

interface Worksheet {
  id: string;
  title: string;
  problemIds: string[];
  pdfOptions: Record<string, unknown>;
  createdAt: string;
}

interface Stroke {
  id: string;
  area: Area;
  tool: 'pen'|'marker';
  color: string;
  width: number;
  points: {x: number; y: number; pressure?: number}[]; // Normalizados.
}

interface BoardSession {
  id: string;
  worksheetId?: string;
  problemIds: string[];
  currentIndex: number;
  annotations: Record<string, {strokes: Stroke[]; textItems: unknown[]}>;
  updatedAt: string;
}
```

Representar valores exactos serializados como cadenas o pares numerador/denominador, no resultados decimales imprecisos. Tipar los campos `unknown` mediante esquemas concretos durante la implementación. Mantener el renderizado PDF separado del de pantalla, compartiendo los datos del problema.

## 12. IA opcional

El producto básico funciona sin IA y sin conexión una vez cargado y disponible en el dispositivo. Para garantizar arranque sin conexión en web hace falta implementar explícitamente caché de aplicación; no confundir persistencia de datos con funcionamiento offline.

Si se añade IA:

- Se usa para proponer contextos o variaciones de texto.
- Recibe el modelo ya resuelto y devuelve un objeto con campos definidos.
- No puede cambiar números, unidades, pregunta o relaciones matemáticas sin validación posterior.
- Las propuestas nuevas quedan pendientes de revisión docente si no se puede validar la equivalencia semántica.
- Si falla, se utiliza el banco local y se informa sin bloquear la sesión.
- Credenciales solo en un servicio seguro, nunca dentro del código cliente.
- No enviar anotaciones ni datos de alumnado.

Prompt orientativo: «Reescribe este enunciado para un nivel lector concreto. Conserva literalmente cantidades, unidades, relaciones y pregunta. No añadas datos. Devuelve solo el objeto del esquema indicado». Aun así, revisar equivalencia; un JSON válido no garantiza un problema correcto.

## 13. Ejemplos completos de salida

### 1.º Primaria: una suma

Enunciado: «Nora tiene 7 lápices. Su compañero le da 5 lápices más. ¿Cuántos lápices tiene ahora?»

Datos: 7 lápices inicialmente y 5 que recibe. Operación: 7 + 5 = 12. Solución: «Ahora tiene 12 lápices». Pista: «Puedes dibujar los dos grupos y juntarlos». Comprobación: 12 − 5 = 7.

### 3.º Primaria: multiplicación y resta

Enunciado: «Para una actividad hay 6 cajas con 8 rotuladores en cada caja. Se reparten 15 rotuladores. ¿Cuántos quedan sin repartir?»

Datos: 6 cajas, 8 por caja y 15 repartidos. Pasos: 6 × 8 = 48; 48 − 15 = 33. Solución: «Quedan 33 rotuladores». Comprobación: 33 + 15 = 48.

### 5.º Primaria: decimales y cambio

Enunciado: «Lucía compra 3 cuadernos de 2,35 € cada uno. Paga con 10 €. ¿Cuánto dinero le devuelven?»

Pasos: 3 × 2,35 € = 7,05 €; 10 € − 7,05 € = 2,95 €. Solución: «Le devuelven 2,95 €». Comprobación: 7,05 € + 2,95 € = 10 €.

### 1.º ESO: enteros

Enunciado: «A las 7:00 la temperatura era de −4 °C. Durante la mañana subió 9 °C y después bajó 3 °C. ¿Qué temperatura marcaba al final?»

Pasos: −4 + 9 = 5; 5 − 3 = 2. Solución: «La temperatura final era de 2 °C». Comprobación: 2 + 3 − 9 = −4.

### 2.º ESO: proporcionalidad inversa

Enunciado: «Cuatro bombas iguales llenan un depósito en 6 horas. ¿Cuánto tardarán tres bombas iguales en llenar ese mismo depósito, si todas mantienen el mismo caudal?»

Pasos: 4 × 6 = 24 horas-bomba; 24 ÷ 3 = 8 horas. Solución: «Tardarán 8 horas». Comprobación: 3 × 8 = 4 × 6. Pista: «Con menos bombas, ¿debería aumentar o disminuir el tiempo?».

### Reto: interpretar un resto

Enunciado: «En una excursión participan 29 personas. Cada furgoneta dispone de 8 plazas para participantes. ¿Cuántas furgonetas necesitan como mínimo?»

29 ÷ 8 = 3, resto 5. Tres furgonetas ofrecen 24 plazas y cuatro ofrecen 32. Solución: «Necesitan 4 furgonetas». Se aclara que las plazas indicadas son para participantes para evitar la ambigüedad del conductor.

### Reto abierto

Enunciado: «Tienes 24 fichas. Colócalas en filas con el mismo número de fichas, sin que sobre ninguna. Encuentra tres distribuciones diferentes y explica cómo sabes que sirven. Girar el mismo rectángulo no cuenta como otra distribución».

Ejemplos: 1 × 24, 2 × 12, 3 × 8 y 4 × 6. Rúbrica: usa las 24 fichas, mantiene igualdad por fila y explica el producto. No dar una única distribución como respuesta exclusiva.

## 14. Anexo: 60 estructuras para iniciar el banco

Son semillas de diseño, no plantillas listas para ejecutar. Implementar en cada una variables, restricciones, solución, pistas, cursos y tres variantes textuales. Completar después las 120 estructuras requeridas.

| ID | Estructura/enunciado base | Modelo o validación |
|---|---|---|
| B01 | Tiene A objetos y recibe B. ¿Cuántos tiene? | A + B |
| B02 | Hay A objetos y se retiran B. ¿Cuántos quedan? | A − B; A ≥ B |
| B03 | Dos grupos de A y B objetos. ¿Cuántos en total? | A + B; reunión |
| B04 | Tiene A y quiere llegar a T. ¿Cuántos faltan? | T − A; T ≥ A |
| B05 | Tiene A; otra persona tiene B. ¿Cuántos más tiene la primera? | A − B; A ≥ B |
| B06 | Recibe B y termina con T. ¿Cuántos tenía? | T − B; estado inicial |
| B07 | Pierde B y termina con T. ¿Cuántos tenía? | T + B |
| B08 | Empieza con A y termina con T tras recibir objetos. ¿Cuántos recibió? | T − A |
| B09 | Empieza con A y termina con T tras regalar objetos. ¿Cuántos regaló? | A − T |
| B10 | Hay A filas de B sillas. ¿Cuántas sillas? | A × B |
| B11 | Cada paquete tiene B piezas. Se compran A paquetes. | A × B; grupos iguales |
| B12 | Repartir T objetos entre P personas. | T ÷ P; P > 0; exacta |
| B13 | Formar grupos de G con T objetos. | T ÷ G; G > 0; exacta |
| B14 | T objetos en G cajas: cajas completas y sobrantes. | Cociente y resto |
| B15 | Transporte de T personas en vehículos de C plazas. | Techo(T/C) |
| B16 | A tiene K veces lo que tiene B, que posee N. | K × N |
| B17 | A tiene T, que es K veces lo de B. ¿Cuánto tiene B? | T ÷ K |
| B18 | Combinar C camisetas con P pantalones. | C × P; combinaciones |
| B19 | Comprar N unidades a precio P. | N × P |
| B20 | Pagar una compra de C con B. | B − C; B ≥ C |
| B21 | Presupuesto B para objetos a P euros. ¿Cuántos como máximo? | Suelo(B/P) |
| B22 | Una cinta de L metros se corta en piezas de P metros. | Cociente; indicar sobrante |
| B23 | Hora inicial y final. ¿Cuánto dura? | Diferencia en minutos |
| B24 | Comienza a H y dura M minutos. ¿Cuándo termina? | Suma de tiempo |
| B25 | Pasar una medida de una unidad a otra. | Factor de conversión |
| B26 | Recorrer A km por la mañana y B km por la tarde. | A + B; decimales |
| B27 | Temperatura inicial T y variación V. | T + V; enteros |
| B28 | Diferencia de altitudes A y B. | A − B; referencia clara |
| B29 | Obtener F de una cantidad T. | Fracción × T |
| B30 | Obtener P % de T. | P × T / 100 |
| M01 | A cajas de B; después se regalan C objetos. | A × B − C |
| M02 | A cajas de B más C unidades sueltas. | A × B + C |
| M03 | Compra A unidades a P y B a Q. | A × P + B × Q |
| M04 | Compra varios artículos y calcula cambio. | Pago − coste total |
| M05 | Existencias iniciales, dos ventas y una reposición. | A − B − C + D |
| M06 | Reparto igual tras apartar una reserva. | (T − R) ÷ P |
| M07 | Reparto igual y posterior entrega extra por persona. | T ÷ P + E |
| M08 | Dinero necesario para varias entradas y transporte. | N × entrada + transporte |
| M09 | Receta para P personas adaptada a Q. | Cantidad × Q/P |
| M10 | Precio por masa y coste de una cantidad decimal. | Precio/kg × kg |
| M11 | Descuento y precio final. | Precio × (1 − P/100) |
| M12 | Aumento porcentual y valor final. | Valor × (1 + P/100) |
| M13 | Dos descuentos sucesivos. | Precio × (1 − p) × (1 − q) |
| M14 | Perímetro de rectángulo y coste de cercado. | 2 × (L + A) × precio/m |
| M15 | Área de superficie y baldosas necesarias. | Área total / área baldosa; unidades iguales |
| M16 | Dos etapas de viaje y una parada. | Suma de tiempos |
| M17 | Consumir fracciones sucesivas del resto. | T × (1 − f) × (1 − g) |
| M18 | Trabajo idéntico con distinto número de trabajadores. | N1 × t1 / N2; hipótesis explícitas |
| M19 | Coincidencia de ciclos de dos actividades. | MCM; interpretar desde inicio común |
| M20 | Formar lotes iguales máximos con dos tipos de objetos. | MCD; preguntar nº de lotes o contenido claramente |
| R01 | Reconstruir cantidad a partir de doble más constante. | 2x + b = T |
| R02 | Encontrar dato innecesario y resolver. | Distractor no cambia solución |
| R03 | Determinar qué dato falta para poder resolver. | Insuficiencia diseñada |
| R04 | Detectar una solución errónea y corregirla. | Error controlado y explicación |
| R05 | Comparar dos ofertas con precios por unidad. | Misma cantidad y unidades |
| R06 | Encontrar varias combinaciones que cumplen presupuesto. | Enumeración finita y validador |
| R07 | Diseñar rectángulos de igual perímetro y comparar áreas. | Enumerar medidas permitidas |
| R08 | Continuar un patrón con regla explícita. | No afirmar unicidad sin especificar regla |
| R09 | Elegir estrategia para minimizar viajes o envases. | Optimización pequeña por enumeración |
| R10 | Inventar un problema para una expresión dada. | Rúbrica: datos, relación y pregunta coherentes |

## 15. Construcción por fases y prompts de continuación

### Fase 1 — Núcleo completo pequeño

«Implementa inicio, generador, presets de ocho cursos, modelo matemático validado, 24 plantillas reales que cubran los ocho cursos, generación de uno y de lotes, vista previa y persistencia. Incluye naturales, enteros y decimales con restricciones. Prueba coherencia numérica y semántica. No implementes todavía IA. Documenta qué falta de la especificación».

### Fase 2 — Pizarra utilizable

«Implementa el modo pizarra del apartado 4: un problema, tres áreas manuscritas, lápiz/borrador/deshacer/rehacer, anotaciones por problema, guardado, navegación, ampliación y pistas ocultas al empezar. Verifica táctil, ratón, redimensionado y restauración. Mantén intacto el generador».

### Fase 3 — Versión inicial completa

«Implementa PDF real con vista previa, ficha limpia y solucionario separado, espacios de Datos/Operaciones/Solución y exportación de anotaciones. Completa el banco hasta 120 estructuras distintas con tres variantes de texto cada una. Incluye fracciones, porcentajes, proporcionalidad, medidas, geometría y retos. Implementa búsqueda, favoritos, editor guiado y copia de seguridad. Comprueba todos los criterios de aceptación».

### Fase 4 — Mejoras opcionales

«Tras estabilizar las funciones centrales, añade perfiles de configuración, modo offline de arranque si el entorno lo permite, lectura en voz alta y generación de versiones equivalentes A/B con dificultad comparable. La variación por IA y sincronización son independientes y opcionales. No introducir dependencias de pago para funciones ya locales».

Versiones A/B deben tener la misma estructura y complejidad aproximada, aunque cambien datos y contexto; no basta con mezclar problemas al azar.

## 16. Criterios de aceptación y verificación

1. Crear un problema válido para cada uno de los ocho cursos; solución comprobable, vocabulario adecuado y configuración respetada.
2. Generar 20 problemas con cobertura configurada sin duplicados; regenerar el quinto y mantener los otros 19 sin cambios.
3. Marcar solo sumas y verificar que resolver no requiere restas, multiplicaciones ni divisiones, salvo estrategias alternativas voluntarias.
4. Activar «Incluir todas» y comprobar cobertura real; si es imposible, informar antes de generar.
5. Generar divisiones exactas sin restos; división con resto siempre con dividendo, divisor, cociente y resto correctos.
6. Interpretar correctamente cajas completas frente a vehículos mínimos.
7. Comprobar 3 × 2,35 = 7,05 y 10 − 7,05 = 2,95, sin residuos visibles de precisión.
8. Restringir negativos y comprobar también todos los pasos intermedios.
9. Comprobar conversiones y dimensiones, fracciones equivalentes y redondeo explícito.
10. Repetir semilla y configuración con la misma versión de plantillas y obtener el mismo problema.
11. Escribir en las tres zonas, navegar, volver y recargar: restaurar todos los trazos en su sitio.
12. Cambiar tamaño, orientación y pantalla completa sin deformar ni borrar anotaciones.
13. Deshacer, rehacer y borrar por zona no afectan a otros problemas.
14. Abrir y ocultar pistas no borra escritura ni revela soluciones en el siguiente problema.
15. Descargar PDF de 1, 5 y 20 problemas; verificar apertura, paginación, tildes, símbolos, texto seleccionable y espacio real para escribir.
16. PDF del alumnado sin respuestas; solucionario con numeración y soluciones correspondientes.
17. Exportar con anotaciones conserva escritura; exportar limpio no incluye trazos.
18. Editar números actualiza toda la solución; edición libre no validable queda marcada como pendiente.
19. Exportar e importar copia de seguridad restaura fichas, banco y sesiones sin duplicación accidental.
20. Navegación por teclado y controles táctiles utilizables. Probar en una pizarra real cuando esté disponible; no afirmar verificación en ese dispositivo si solo se probó escritorio.
21. Generar muestras de todas las plantillas en varias semillas y verificar invariantes. Revisar manualmente muestras de texto, especialmente concordancia, ambigüedad y relación con operaciones.
22. El contador del banco muestra 120 estructuras reales, no 120 instancias de unas pocas estructuras.
23. Ningún botón central es decorativo: guardar, regenerar, pizarra, PDF, favoritos e importar/exportar tienen efecto real y comunican errores.

La entrega debe explicar funciones implementadas, verificaciones realizadas y limitaciones concretas pendientes. Priorizar que la escritura funcione en clase y que las soluciones sean correctas sobre añadir animaciones o funciones secundarias.
