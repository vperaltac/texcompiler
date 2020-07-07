[![Build Status](https://travis-ci.org/vperaltac/texcompiler.svg?branch=master)](https://travis-ci.org/vperaltac/texcompiler)
[![CircleCI](https://circleci.com/gh/vperaltac/texcompiler.svg?style=svg)](https://circleci.com/gh/vperaltac/texcompiler)
[![codecov](https://codecov.io/gh/vperaltac/texcompiler/branch/master/graph/badge.svg)](https://codecov.io/gh/vperaltac/texcompiler)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# TexCompiler
Proyecto para la asignatura Infraestructura Virtual (19-20).

## Descripción

Microservicio para compilar documentos LaTeX (.tex) y proveer el PDF generado para un editor de LaTeX en línea. Se implementará utilizando comunicación basada en eventos.
Se pueden ver más detalles sobre la historia del proyecto en la sección de [proyectos](https://github.com/vperaltac/texcompiler/projects/1) de GitHub. Se actualizará debidamente cada vez que el cliente se ponga en contacto conmigo.

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
DockerHub: https://hub.docker.com/r/vperaltac/texcompiler
```

## Provisionamiento
```
provision: provision/playbook.yml
```

## Documentación sobre el provisionamiento de máquinas virtuales
* [Evaluación de prestaciones](https://vperaltac.github.io/texcompiler/#/eleccion_so)
* [Provisionamiento de máquinas virtuales](https://vperaltac.github.io/texcompiler/#/provisionamiento)

## Documentación adicional
Visita la [documentación](https://vperaltac.github.io/texcompiler) para ver toda la información sobre el proyecto.

* [Descripción del proyecto](https://vperaltac.github.io/texcompiler/#/descripcion)
* [Despliegue en un PaaS](https://vperaltac.github.io/texcompiler/#/paas)
* [Documentación sobre la herramienta de construcción](https://vperaltac.github.io/texcompiler/#/tools_construccion)
* [Documentación sobre tests, rutas y tareas](https://vperaltac.github.io/texcompiler/#/tests)
* [Documentación sobre la integración continua](https://vperaltac.github.io/texcompiler/#/integracion_continua)
* [Documentación sobre bibliotecas y herramientas utilizadas](https://vperaltac.github.io/texcompiler/#/bibtools)
* [Despliegue del contenedor](https://vperaltac.github.io/texcompiler/#/docker)
* [Documentación de API REST](https://vperaltac.github.io/texcompiler/apidoc/index.html)
* [Documentación del código implementado](https://vperaltac.github.io/texcompiler/docco/texCompiler.html)
* [Diario de desarrollo](https://vperaltac.github.io/texcompiler/#/diario)