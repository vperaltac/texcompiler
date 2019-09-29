 [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
# IV-Proyecto
Proyecto para la asignatura Infraestructura Virtual (19-20).

## Descripción

Servicio web para compilar documentos LaTeX (.tex) y proveer el PDF generado. El envío del documento latex y la recepción del PDF generado se realizarán mediante el protocolo HTTP.

## Motivación

A lo largo de la primera mitad del año 2019 he estado ayudando a un compañero de la carrera a redactar su Trabajo Fin de Grado con LaTeX.
La colaboración era esporádica y esto provocaba que cuando necesitaba mi ayuda para resolver algún problema, el proyecto había avanzado consideradamente y la compilación del mismo solía devolver algún tipo de error, principalmente porque usábamos distribuciones TeX diferentes (MiKTeX y XeLateX) y por la falta de paquetes instalados.

Este Servicio web debería ayudar a proveer una plataforma que asegura generar el documento final utilizando la misma distribución TeX y los mismos paquetes.

## Lenguajes y tecnologías a utilizar
### Lenguaje de programación y entorno de desarrollo
El proyecto se desarrollará en [Node.js](https://nodejs.org/es/).
Creo firmemente en utilizar un framework solo cuando las ventajas son claramente favorables. En muchas ocasiones se opta por elegir un framework para simplificar cierta tarea sin tener en cuenta la pérdida de rendimiento inherente.
Por tanto, en principio este servicio se desarrollará con puro Node.js y solo utilizaré un framework si su utilidad me convence. [Express](https://expressjs.com/es/) es un candidato, pero necesito investigar más a fondo antes de tomar esta decisión.

### Sistema de Logs
Mantener un sistema de logs es crucial para poder detectar problemas en la ejecución o despliegue del proyecto. Por tanto, como herramienta para administración de logs voy a utilizar [Logstash](https://www.elastic.co/products/logstash), es una solución de código libre con toda la funcionalidad necesaria para este proyecto.

### Aplicaciones externas
Dado que mi servicio compilará archivos .tex será necesario instalar una distribución TeX, utilizaré [TexLive](https://www.tug.org/texlive/).

### Bases de datos
La utilidad de una base de datos para mi servicio es baja, aún así si decido utilizar una base de datos será [MongoDB](https://www.mongodb.com/es) por su facilidad de uso, versatilidad y fantástica integración con node.js.

### Desarrollo basado en tests
Para realizar tests utilizaré [Mocha](https://mochajs.org/) 

### Gestor de versiones
Utilizaré [nvm](https://github.com/nvm-sh/nvm) como gestor de versiones.

### Integración continua
Utilizaré [Travis CI](https://travis-ci.org/) para la integración continua.

### Despliegue
Dado que mi proyecto necesita un sistema Linux para funcionar, necesito una máquina virtual o contenedor para almacenarla. Por tanto los candidatos para esto son [Docker](https://www.docker.com/) y [Microsoft Azure](https://azure.microsoft.com/es-es/). Dado que mi conocimiento sobre las diferentes soluciones es limitado, es muy posible que este apartado sea modificado en el futuro.

A lo largo del desarrollo del proyecto puede que, una vez empiece a utilizar las herramientas seleccionadas, alguna no se ajuste exactamente a mis propósitos, si es así, la nueva herramienta se indicará en la documentación del proyecto.