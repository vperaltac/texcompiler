<!-- bibtests.md -->

# Bibliotecas y programas de tests
Todas las bibliotecas se encuentran listadas en el archivo `package.json`:
```
{
  "name": "texcompiler",
  "version": "1.3.0",
  "description": "compilador de documentos latex",
  "main": "index.js",
  "scripts": {
    "test": "mocha"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/victorperalta93/IV-Proyecto.git"
  },
  "author": "Victor Peralta",
  "license": "GPL-3.0",
  "bugs": {
    "url": "https://github.com/victorperalta93/IV-Proyecto/issues"
  },
  "homepage": "https://github.com/victorperalta93/IV-Proyecto#readme",
  "dependencies": {
    "amqplib": "^0.5.5",
    "core-util-is": "^1.0.2",
    "express": "^4.17.1"
  },
  "devDependencies": {
    "chai": "^4.2.0",
    "docco": "^0.8.0",
    "grunt": "^1.0.4",
    "grunt-cli": "^1.3.2",
    "grunt-contrib-clean": "^2.0.0",
    "grunt-docco": "^0.5.0",
    "grunt-run": "^0.8.1",
    "mocha": "^6.2.1"
  }
}

```

A continuación añado una justificación de cada biblioteca utilizada.

## Chai
Chai es una biblioteca de aserciones para node. La he utilizado junto a Mocha para realizar tests sobre la biblioteca desarrollada hasta el momento.

## Mocha
Mocha es un framework de pruebas para node. Junto a chai se convierte en una herramienta muy útil para realizar tests sobre las bibliotecas y clases de nuestro proyecto. En mi caso, los tests realizados son los siguientes:

```
describe('TexCompiler', function(){
    it('Debería cargar la biblioteca y poder instanciarse',function(){
        texCompiler.should.exist
    })

    it('Debería informar de que el archivo tiene una extensión errónea',function(){
        expect(texCompiler('ejemplo.tar',false)).to.equal('Formato incorrecto.')
    })

    it('Debería informar de que recibe un archivo que no existe',function(){
        expect(texCompiler('archivo_fantasma.tex',false)).to.equal('Archivo no encontrado.')
    })

    it('Debería confirmar que la ejecución ha sido correcta.',function(){
        expect(texCompiler('ejemplo.tex',false)).to.equal('Archivo creado con éxito.')
    })
})
```

Mocha proporciona una sintaxis muy legible y fácil de leer aunque no se esté muy familiarizado con la herramienta. Estos tests se ejecutan tanto con `grunt test` como `npm test`. Aunque siempre recomiendo el primero.

## Docco
He utilizado Docco para generar la documentación del código en formato HTML de forma automática. Se puede ver [aquí](https://victorperalta93.github.io/IV-Proyecto/docco/texCompiler.html).

## Grunt
He utilizado Grunt para automatizar la generación de documentación de docco, así como realizar los tests desarrollados con Mocha y Chai y realizar una limpieza de los archivos generados durante el testeo. El archivo de configuración de Grunt es el siguiente:

```
'use strict';

module.exports = function(grunt) {

  // Configuración del proyecto
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    docco: {
        debug: {
        src: ['src/*.js','test/*.js','*.js'],
        options: {
            output: 'docs/docco'
        }
        }
    },
    
    clean: ['doc/*.aux','doc/*.log','doc/*.gz','doc/*.pdf'],

    run: {
      npm_test: {
        cmd: 'npm',
        args: [
          'test'
        ]
      }
    }
  });

  // Carga el plugin de grunt para generar documentación con docco
  grunt.loadNpmTasks('grunt-docco');

  // Carga el plugin de grunt para eliminar archivos
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Carga el plugin para ejecutar comandos de la terminal
  grunt.loadNpmTasks('grunt-run');

  // Tarea para ejecutar los tests unitarios
  grunt.registerTask('test', ['run:npm_test','clean']);

  // Tarea por defecto: genera documentacion, ejecuta tests y limpia archivos generados
  grunt.registerTask('doc',['docco']);
};
```

En este archivo se definen las siguientes tareas o *tasks*:
* __test__: ejecutar los tests unitarios y limpiar los archivos generados.
* __clean__: limpieza de archivos generados en compilación.
* __doc__: generación de documentación con docco.