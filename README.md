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

Este proyecto se desarrollará en PHP.
