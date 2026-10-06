# Publicar Problemia en GitHub Pages

© 2026 Francisco Serrano Jiménez - El Maestro Paco.
[Web del autor](https://sites.google.com/view/elmaestropaco/inicio)

## Subir los archivos

1. Crea un repositorio en GitHub, por ejemplo `problemia`.
2. Sube **el contenido** de la carpeta `Problemia-GitHub` a la raíz del repositorio. No subas solamente el ZIP ni dejes `index.html` dentro de otra carpeta.
3. Conserva las carpetas `fonts` y `vendor`, todos los archivos JavaScript y `.nojekyll`.
4. Activa GitHub Pages en la configuración del repositorio, con publicación desde la rama donde subiste los archivos y la carpeta raíz.
5. Abre la dirección que GitHub indique al terminar la publicación. Para un repositorio de proyecto suele ser `https://TU-USUARIO.github.io/problemia/`.

No hay que compilar, instalar dependencias, introducir claves ni contratar un servidor. Las rutas son relativas para funcionar tanto en la raíz como en una subcarpeta.

## Primera comprobación

Genera una ficha, abre la pizarra, guarda un material y descarga los dos PDF. Cambia a letra escolar y comprueba que sigue seleccionada al recargar. Tras la primera visita completa, la aplicación puede arrancar sin conexión; la lectura en voz alta depende de las voces del dispositivo.

Los materiales son locales a cada navegador y dirección web. Los guardados al abrir el archivo del escritorio no se trasladan automáticamente a GitHub Pages: exporta una copia JSON e impórtala en la web publicada.

## Actualizar

Sustituye los archivos modificados. Si cambias los recursos de la aplicación, cambia también la versión de caché en `sw.js` para que se renueve el contenido sin conexión. No subas archivos con datos personales, copias de materiales de alumnado ni `node_modules`.

## Alcance del generador

Los cursos y dificultades usan referencias orientativas, no una certificación curricular. Elegir contenidos que todavía no corresponden al curso activa una configuración personalizada. Cada problema aritmético utiliza todas las operaciones marcadas; en los contenidos especializados hay operaciones propias del tema, como multiplicar para hallar un área.

Se permite un tema principal especializado por problema, combinado con decimales, fracciones, porcentajes y las cuatro operaciones. La aplicación avisa si se mezclan varios temas principales incompatibles. El selector de divisiones enteras regula cociente y resto en los problemas aritméticos; los contenidos especializados calculan racionales exactos.

La lógica cuenta con seis modelos de reglas explícitas. Se evita presentar sucesiones sin regla como si tuvieran una única respuesta. Los idiomas crean versiones matemáticas equivalentes, no traducciones literales de las historias.

Las variantes son finitas: no se garantiza que nunca se repita una estructura. Los filtros restrictivos reducen la variedad. Es recomendable revisar la ficha antes de entregarla; los problemas editados requieren confirmación docente antes de imprimir o exportar.

Consulta `REVISION.md` para las pruebas de esta entrega y `COPYRIGHT.md` para la autoría y licencias de terceros.
