<!-- descripcion_bib.md -->

## Descripción de la biblioteca desarrollada
La biblioteca desarrollada es [texCompiler.js](https://github.com/vperaltac/IV-Proyecto/blob/master/src/texCompiler.js).  
Recibe los siguientes parámetros:
* `archivo`: archivo con extensión .tex para compilar. Debe estar en el directorio `doc`.
* `tex_output`: 
  * `true` para mostrar la salida que devuelve `pdflatex`.  
  * `false` para no mostrarla.  

La función principal de esta biblioteca es generar una salida en formato `pdf` de un archivo LaTeX. Por ahora esta función se realiza con llamadas síncronas en la terminal de Linux. En el futuro estas llamadas pasarán a ser asíncronas.
Se trata de la función principal de mi proyecto, el resto del mismo se desarrollará con esta función como eje principal.
