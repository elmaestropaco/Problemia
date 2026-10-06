# Problemia

Webapp estática para GitHub Pages, de 1.º de Primaria a 2.º de ESO. Publica la carpeta completa. También puedes abrir `index.html` directamente. No requiere cuentas ni claves de servicios externos.

© 2026 [Francisco Serrano Jiménez - El Maestro Paco](https://sites.google.com/view/elmaestropaco/inicio).

Consulta [PUBLICAR.md](PUBLICAR.md) para subirla a GitHub Pages y [REVISION.md](REVISION.md) para las pruebas de la entrega.

## Qué ofrece

- Problemas aritméticos con todas las operaciones elegidas, 27 contextos, modelos con ramas y controles de números, llevadas y divisiones.
- En 1.º y 2.º de Primaria, banco específico con ocho contextos cotidianos, frases cortas y una acción por frase. La dificultad aumenta los cálculos, no el vocabulario; los retos de razonamiento también usan consignas breves.
- Decimales, fracciones, porcentajes, medidas, área/perímetro, proporciones directas e inversas, MCD/MCM, potencias, raíces exactas y ecuaciones. Los contenidos se pueden combinar con las cuatro operaciones. Se permite un tema principal por problema más fracciones, decimales y porcentajes; las combinaciones incompatibles se explican sin ignorar filtros.
- Cálculos especializados con racionales exactos. Los importes monetarios mantienen precisión de céntimos; los objetos indivisibles no tienen cantidades fraccionarias.
- Vocabulario cotidiano y tareas de razonamiento: errores, elección de respuesta, dibujos y explicación de estrategias.
- Seis modelos de lógica con reglas explícitas: series aditivas, cantidades ocultas, posiciones, series multiplicativas, procesos inversos y reglas alternas. Los primeros cursos usan los tres modelos iniciales.
- Representaciones de operaciones combinadas con paréntesis en las soluciones y pistas de pizarra. En los niveles superiores aparecen áreas con recortes y porcentajes sucesivos.
- Historial de formulaciones que evita repeticiones también entre sesiones. Con filtros muy restrictivos disminuye la variedad.
- PDF de ficha y solucionario con la fuente elegida incrustada: Borel para letra ligada, Helvetica para imprenta y Noto Naskh Arabic para árabe. Cuadros blancos sin rayas.
- Preferencias persistentes, sesiones de pizarra, favoritos, biblioteca y borrado de materiales.
- Edición de enunciado y solución, creación de problemas propios y revisión docente obligatoria antes de exportar textos modificados.
- Copias JSON versionadas, importación validada y aditiva sin sobrescribir materiales existentes ni duplicar identificadores. Los ajustes actuales del dispositivo se conservan.
- Idiomas inglés, francés y árabe desde el modelo matemático: versiones completas equivalentes, no traducción literal del texto original. No se traduce automáticamente un texto escrito a mano sin modelo.
- Arranque offline mediante Service Worker tras la primera visita en HTTPS o localhost. Fuentes y librería PDF incluidas localmente. No hay dependencias de red para el uso principal.

## Código

`app.js` contiene estado e interacción, sin generadores duplicados. `app-fix.js` contiene preferencias, navegación y PDF. `learning-profile.js` define presets orientativos por curso. `problem-engine.js` y `story-bank.js` generan problemas aritméticos; `advanced-bank.js` resuelve contenidos especializados; `reasoning.js` adapta la tarea y simplifica el vocabulario. `materials.js`, `languages.js` y `offline.js` contienen sus funciones respectivas.

La escritura usa eventos de puntero, captura y trazos normalizados independientes por problema. Las anotaciones son trabajo de aula; no se corrigen automáticamente. Los datos se guardan en este navegador: borrar sus datos borra los materiales. Exporta copias con frecuencia.

## Verificación

Para desarrollar y repetir las pruebas en otro equipo, instala Node.js, ejecuta `npm install` y `npx playwright install chromium`. Después ejecuta `npm run test:arithmetic`, `npm run test:advanced` y `npm test`. Estas dependencias son solo para las pruebas: GitHub Pages no las necesita. En este equipo también se puede usar la instalación local de Playwright. Las pruebas cubren:

- 640 problemas aritméticos en ocho cursos y cuatro dificultades, restricciones, continuidad o árboles y cobertura de operaciones.
- 264 problemas especializados y combinaciones con las cuatro operaciones; soluciones racionales, céntimos y filtros incompatibles.
- 100 textos sin repetición incluso al eliminar sus números.
- Preferencias persistentes, descarga y paginación de PDF, fuente Borel efectiva y cuadros sin pauta.
- Idiomas, editor, importación válida/inválida y ausencia de duplicados.
- Instalación del Service Worker bajo una subcarpeta y recarga/generación con la red desactivada.
- 5.600 problemas adicionales de lógica y contenidos recomendados por curso, incluyendo lotes de veinte y comprobación matemática independiente.

## Límites que quedan

Los presets no certifican una alineación curricular. El objetivo original de 120 estructuras matemáticas independientes sigue pendiente; no se cuentan contextos o nombres como nuevas estructuras. El editor modifica problemas concretos, no añade código ni reglas ejecutables al motor. La traducción literal libre y la sincronización entre dispositivos requieren una ampliación distinta. La calidad de la voz y los eventos de resaltado dependen del navegador.

Fuentes distribuidas con sus licencias OFL en `fonts/`. jsPDF 2.5.1 se distribuye en `vendor/` bajo licencia MIT incluida en su cabecera. La especificación original se conserva en `Especificacion_Vibecode_Problemas_Matematicos.md`.
