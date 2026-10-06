# Revisión de publicación — 6 de octubre de 2026

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
