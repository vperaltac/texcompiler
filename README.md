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


## Cómo ejecutar los tests
Para ejecutar los tests utiliza:
```
grunt test
```
Este comando ejecuta tanto los tests unitarios como los de integración.

## Herramienta de construcción
```
buildtool: Gruntfile.js
```

## Despliegue en Heroku

```
Despliegue: https://texcompiler.herokuapp.com/
```

## Despliegue del contenedor
```
Contenedor: https://texcompiler-docker.azurewebsites.net
```

## DockerHub
```
DockerHub: https://hub.docker.com/r/victorperalta93/texcompiler
```

## Provisionamiento
```
provision: provision/playbook.yml
```

## Documentación sobre el provisionamiento de máquinas virtuales
* [Evaluación de prestaciones](https://victorperalta93.github.io/IV-Proyecto/#/eleccion_so)
* [Provisionamiento de máquinas virtuales](https://victorperalta93.github.io/IV-Proyecto/#/provisionamiento)

## Documentación adicional
Visita la [documentación](https://victorperalta93.github.io/IV-Proyecto) para ver toda la información sobre el proyecto.

* [Descripción del proyecto](https://victorperalta93.github.io/IV-Proyecto/#/descripcion)
* [Despliegue en un PaaS](https://victorperalta93.github.io/IV-Proyecto/#/paas)
* [Documentación sobre la herramienta de construcción](https://victorperalta93.github.io/IV-Proyecto/#/tools_construccion)
* [Documentación sobre tests, rutas y tareas](https://victorperalta93.github.io/IV-Proyecto/#/tests)
* [Documentación sobre la integración continua](https://victorperalta93.github.io/IV-Proyecto/#/integracion_continua)
* [Documentación sobre bibliotecas y herramientas utilizadas](https://victorperalta93.github.io/IV-Proyecto/#/bibtools)
* [Despliegue del contenedor](https://victorperalta93.github.io/IV-Proyecto/#/docker)
* [Documentación de API REST](https://victorperalta93.github.io/IV-Proyecto/apidoc/index.html)
* [Documentación del código implementado](https://victorperalta93.github.io/IV-Proyecto/docco/texCompiler.html)
* [Diario de desarrollo](https://victorperalta93.github.io/IV-Proyecto/#/diario)