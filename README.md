[![Build Status](https://travis-ci.org/victorperalta93/IV-Proyecto.svg?branch=master)](https://travis-ci.org/victorperalta93/IV-Proyecto)
[![CircleCI](https://circleci.com/gh/victorperalta93/IV-Proyecto.svg?style=svg)](https://circleci.com/gh/victorperalta93/IV-Proyecto)
[![codecov](https://codecov.io/gh/victorperalta93/IV-Proyecto/branch/master/graph/badge.svg)](https://codecov.io/gh/victorperalta93/IV-Proyecto)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# TexCompiler
Proyecto para la asignatura Infraestructura Virtual (19-20).

## Descripción

Microservicio para compilar documentos LaTeX (.tex) y proveer el PDF generado para un editor de LaTeX en línea. Se implementará utilizando comunicación basada en eventos.
Se pueden ver más detalles sobre la historia del proyecto en la sección de [proyectos](https://github.com/victorperalta93/IV-Proyecto/projects/1) de GitHub. Se actualizará debidamente cada vez que el cliente se ponga en contacto conmigo.

## Instalación
Para instalar el proyecto basta con ejecutar:
```
npm install 
```

## Cómo lanzar la aplicación
```
grunt start
```

## Cómo parar la aplicación
```
grunt stop
```

## Cómo ejecutar los tests
Para ejecutar los tests utiliza:
```
grunt test
```
Las pruebas se ejecutan con `npm test` y se elimina automáticamente los archivos generados durante el proceso.

## Herramienta de construcción
```
buildtool: Gruntfile.js
```

## Documentación adicional
Visita la [web de documentación](https://victorperalta93.github.io/IV-Proyecto) para ver toda la información sobre el proyecto.

* [Descripción del proyecto](https://victorperalta93.github.io/IV-Proyecto/#/descripcion)
* [Documentación sobre la herramienta de construcción](https://victorperalta93.github.io/IV-Proyecto/#/tools_construccion)
* [Documentación sobre tests, rutas y tareas](https://victorperalta93.github.io/IV-Proyecto/#/tests)
* [Documentación sobre la integración continua](https://victorperalta93.github.io/IV-Proyecto/#/integracion_continua)
* [Documentación sobre bibliotecas y herramientas utilizadas](https://victorperalta93.github.io/IV-Proyecto/#/bibtools)
* [Documentación de API REST](https://victorperalta93.github.io/IV-Proyecto/apidoc/index.html)
* [Documentación del código implementado](https://victorperalta93.github.io/IV-Proyecto/docco/texCompiler.html)
* [Diario de desarrollo](https://victorperalta93.github.io/IV-Proyecto/#/diario)