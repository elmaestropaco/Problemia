# Revisión de publicación — 6 de octubre de 2026

## Actualización del 19 de octubre de 2026

### Comprobación de selecciones de cuatro y cinco opciones

Se añade una validación al generar: las cuatro operaciones aritméticas se contrastan con los pasos calculados y los contenidos especializados con las partes del árbol que los trabajan. Los problemas guardan las opciones solicitadas y las efectivamente comprobadas; una etiqueta de tema no basta para acreditar su presencia. Los decimales generan datos realmente no enteros. Al editar manualmente un problema se retira esta comprobación automática.

En el modo obligatorio, cada problema debe incorporar todas las opciones compatibles. En el modo mezclado se priorizan las opciones todavía no trabajadas para cubrir toda la selección cuando el número de problemas es igual o superior al de opciones, también si se desactiva el reparto equilibrado. En dificultad alta se permiten combinaciones de hasta cinco opciones, manteniendo también problemas de una sola operación. Los filtros imposibles o contenidos incompatibles no se descartan silenciosamente.

`verify-selection.cjs`: 780 problemas en modo obligatorio y 2.520 en modo mezclado. Incluye cuatro operaciones en todos los cursos y dificultades, las cuatro operaciones con un quinto contenido especializado, mezclas de cuatro o cinco contenidos, cantidades de 5/10/20, reparto equilibrado activado y desactivado, presencia de cinco opciones en un mismo modelo, controles en la interfaz y rechazo de etiquetas sin evidencia. Se mantiene el resto de baterías y se comprueba la actualización desde la publicación anterior. Caché actual: v6.

### Segunda revisión a partir de los ejemplos de tenis, campamento y piscina

Se corrigen tres plantillas residuales que todavía decían «en cada recipiente». Un único redactor de envíos utiliza el envase concreto. Las preguntas dependen de los sucesos del modelo: total recibido o reunido, material que queda tras una retirada, disponibilidad sin reservas y cantidad de cada equipo. Los repartos preguntan por bolsas, cajas o carpetas, no por «grupos» genéricos. En tenis se usan cajas; en la piscina una entrega de un gorro se describe con un nadador, no con un sujeto plural ambiguo.

`verify-story-language.cjs` recorre las quince combinaciones aritméticas, cuatro dificultades, nueve estructuras y veinte contextos: 10.533 modelos válidos en esa matriz. Verifica que no se use «queda» si no ha habido una retirada, que no reaparezcan los envases genéricos, y que las soluciones no cambien. Incluye los tres ejemplos con respuestas 51, 149 y 62. Son pruebas de regresión, no una certificación lingüística de cualquier frase futura.

La caché pasa a v5. Se comprueba explícitamente la versión activa del Service Worker mediante mensajes durante la prueba de actualización desde v4, y se verifica la redacción nueva también sin conexión. El HTML comprueba las actualizaciones aunque el navegador conserve los scripts anteriores. Si ya se ha interactuado con la página, ofrece un botón de recarga en lugar de interrumpir una edición o un trazo.

Se separa la redacción de las situaciones de la distribución de operaciones. Las historias aritméticas usan acciones propias de cada contexto, identifican recipientes concretos y agrupan entradas adicionales para reducir frases repetidas. Los contenidos especializados mantienen el referente y sus unidades: no se habla de guardar un precio para otro día ni de la duración de puntos de un juego. Las ecuaciones preguntan por la incógnita, no por un total que ya se conoce. Los repartos posteriores conservan la distinción entre cada parte y el total. Los conteos de objetos no admiten fracciones intermedias de fichas o paquetes.

El selector persistente «Cómo combinar lo marcado» conserva el modo obligatorio y añade un modo de repertorio: distribuye opciones entre problemas, alterna selecciones individuales y combinaciones, y separa temas principales incompatibles. La regeneración individual sigue utilizando el repertorio de la ficha. Las consignas de razonamiento no se reinician siempre en la misma variante al generar problemas de uno en uno.

Nueva batería `verify-planner.cjs`: 464 problemas de las matrices de mezcla, más casos de cantidad uno, modo obligatorio, concordancia, incógnitas, puntos, cobertura de temas y persistencia del selector. Se mantienen las otras baterías de aritmética, contenidos especializados, lectura inicial y publicación. Las cinco matrices principales suman 8.768 problemas; estas pruebas no certifican por sí solas la naturalidad de todo texto posible.

La caché pasa a `problemia-local-v4` e incluye los tres módulos nuevos. La publicación sigue siendo estática y sin servicios externos. Los materiales antiguos conservan su redacción hasta que se editen o regeneren.

También se ha ejecutado `verify-upgrade.cjs` contra la carpeta de publicación anterior, con caché v3: actualización a v4, generación mezclada sin conexión, conservación de materiales y de la letra escolar, sin errores de JavaScript. Los recursos tienen versión explícita y la lectura de caché se limita a la versión activa, para evitar mezclar código antiguo con el nuevo. Para repetir esta prueba es necesaria una copia de una publicación anterior: `node verify-upgrade.cjs RUTA_ANTERIOR`.

## Actualización: lectura en el primer ciclo

Se ha añadido `early-reading-bank.js` para los problemas aritméticos de 1.º y 2.º de Primaria: ocho contextos familiares, frases cortas, una acción por frase y todas las operaciones elegidas. No se usan historias de pedidos, almacenes o inventarios como alternativa cuando los filtros son restrictivos. Los retos de razonamiento de estos cursos también tienen consignas breves. El ajuste «Detallado» añade un contexto corto, no una historia larga.

La prueba `node verify-reading.cjs` recorre 1.800 problemas: ambos cursos, cuatro dificultades, tres longitudes y las quince combinaciones aritméticas. Comprueba longitud, operaciones, resultados, vocabulario y la regresión de concordancia del ejemplo comunicado. El límite de prueba es de 50 palabras para una o dos operaciones y 80 para combinaciones de tres o cuatro, incluyendo consignas de razonamiento. Los problemas normales de suma y resta son sensiblemente más cortos.

Los materiales guardados anteriormente conservan sus textos: hay que generar problemas nuevos o editar esos materiales. La caché de publicación se ha actualizado a `problemia-local-v3` para cargar el banco nuevo después de actualizar la web.

## Pruebas automatizadas ejecutadas

- `verify.cjs`: 640 problemas aritméticos en ocho cursos y cuatro dificultades; operaciones elegidas, cálculo, llevadas y divisiones. Una muestra adicional de 100 textos dio 100 formulaciones distintas al eliminar los números, con siete modelos y quince contextos.
- `verify-advanced.cjs`: 264 problemas especializados, combinaciones de decimales/fracciones/porcentajes, dinero exacto en céntimos, idiomas, importación, edición y funcionamiento sin conexión desde una subcarpeta HTTP.
- `verify-release.cjs`: 5.600 problemas de lógica y contenidos recomendados en todos los cursos y dificultades. Lotes de veinte para cada contenido especializado, solos y con las cuatro operaciones; cálculo racional contrastado con un evaluador independiente. Se verificaron seis modelos de lógica, razonamiento racional, fórmulas combinadas, navegación atrás/adelante y menú móvil.
- Descargas de ficha y solucionario; Borel efectivamente usada en los enunciados, cuadros sin líneas y copyright en el PDF.
- Caso extremo con un enunciado largo en letra escolar: paginación y comprobación de que los bloques de texto no salen de la página.

Los contadores incluyen 6.504 problemas en las tres matrices principales, además de las pruebas de restricciones y diversidad. Son pruebas representativas, no una garantía de corrección de cualquier combinación futura ni una certificación del currículo.

## Correcciones de esta revisión

Lógica con reglas claras; propuestas de razonamiento con racionales; bancos de potencias, medidas y divisibilidad capaces de completar fichas de veinte; cantidades y dependencia de cálculos según dificultad; áreas con recortes y porcentajes sucesivos en niveles superiores; representación de árboles de operaciones sin revelar el resultado en la ficha; PDFs largos sin desbordamientos ni primera página vacía; voz según idioma; edición coherente después de cambiar idioma; soluciones ocultas al imprimir fichas; caché actualizada y atribución del autor.

## Límites explícitos

No se han añadido 120 estructuras independientes: el banco aritmético combina 27 contextos con nueve estructuras adicionales al motor lineal. La repetición absoluta no puede eliminarse en un banco finito. Las tareas de dibujo y explicación requieren valoración docente. El cambio de idioma no conserva literalmente la historia. No hay sincronización en la nube, autocorrección de trazos ni backend.
