<!-- tools_construccion.md -->

# Herramientas de construcción
## Grunt
Mi herramienta principal de construcción es [__Grunt__](https://gruntjs.com/).  
Grunt permite automatizar todo tipo de tareas desde compilación y minificación hasta tests unitarios o de integración.
La configuración de dicha herramienta se hace a través del archivo `Gruntfile.js`, el cual sigue una configuración similar a `package.json`.
> Importante: `Gruntfile.js` debe estar en el mismo directorio que `package.json`.

El archivo de configuración `Gruntfile.js`:
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

    clean: ['doc/*.aux','doc/*.log','doc/*.gz','doc/*.pdf','doc/*.fdb*','doc/*.fls'],

    run: {
      npm_test: {
        cmd: 'npm',
        args: [
          'test'
        ]
      },

      npm_unit_test: {
        cmd: 'npm',
        args: ['run','unit-test']
      },

      npm_int_test: {
        cmd: 'npm',
        args: ['run','int-test']
      },

      npm_report_coverage:{
        cmd: 'npm',
        args: ['run','report-coverage']
      },

      pm2_start:{
        cmd: 'pm2',
        args: ['start','src/index.js','--name','texCompiler']
      },

      pm2_reload:{
        cmd: 'pm2',
        args: ['restart','texCompiler']
      },

      pm2_restart:{
        cmd: 'pm2',
        args: ['reload','texCompiler']
      },

      pm2_stop:{
        cmd: 'pm2',
        args: ['stop','texCompiler']
      }
    }
  });

  grunt.config.set('apidoc', {
    tex: {
      src: "src/",
      dest: "docs/apidoc/"
    }
  });

  // Carga el plugin para generar la documentación de la API REST
  grunt.loadNpmTasks('grunt-apidoc');

  // Carga el plugin de grunt para generar documentación con docco
  grunt.loadNpmTasks('grunt-docco');

  // Carga el plugin de grunt para eliminar archivos
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Carga el plugin para ejecutar comandos de la terminal
  grunt.loadNpmTasks('grunt-run');

  // Tarea para ejecutar todos los tests
  grunt.registerTask('test', ['run:npm_test','clean']);

  // Tarea para ejecutar los tests unitarios
  grunt.registerTask('unit-test',['run:npm_unit_test','clean'])

  // Tarea para ejecutar los tests de integración
  grunt.registerTask('int-test',['run:npm_int_test','clean'])

  // Tarea por defecto: genera documentacion, ejecuta tests y limpia archivos generados
  grunt.registerTask('doc',['docco']);

  // Tarea para lanzar el servicio con pm2
  grunt.registerTask('start',['run:pm2_start']);

  // Tarea para parar el servicio con pm2
  grunt.registerTask('stop',['run:pm2_stop']);

  // Tarea para recargar el servicio con pm2
  grunt.registerTask('reload',['run:pm2_reload']);

  // Tarea para reiniciar el servicio con pm2
  grunt.registerTask('restart',['run:pm2_restart']);

  grunt.registerTask('report-coverage',['run:npm_report_coverage']);
};
```

Vamos a enumerar y explicar cada una de las tareas o *tasks* por el orden en que aparecen en el archivo:

* __test__: ejecuta los tests tanto unitarios como de integración del proyecto. Además, ejecuta la orden clean para hacer limpieza de archivos generados durante los tests. Dicha orden se puede ver más abajo.
* __unit-test__: ejecuta los tests unitarios del proyecto. Esta tarea está pensada para ser ejecuta en integración continua. Travis CI se encarga de lanzar estos tests. Al finalizar limpia los archivos generados.
* __int-test__: ejecuta los tests de integración del proyecto. Esta tarea está pensada para ser ejecutada en integración continua. CircleCI se encarga de lanzar estos tests. Al finalizar limpia los archivos generados.

Para saber más sobre integración continua puedes dirigirte a [su sección en la documentación](integracion_continua.md).

* __doc__: genera la documentación del proyecto con docco.
* __start__: arranca el proceso del proyecto mediante la herramienta __PM2__.
* __stop__: detiene el proceso del proyecto mediante la herramienta __PM2__.
* __reload__: recarga el proceso del proyecto mediante __PM2__. reload asegura que el servicio esté disponible durante la recarga, aunque para hacer esto tarda un poco más que `restart`.
* __restart__: mata y reinicia el proceso mediante __PM2__. Es más rápido que reload pero el servicio no estará disponible durante el reinicio.
* __report-coverage__: Envía la información de cobertura a [codecov](https://codecov.io/). Esta orden la utilizan los sistemas de integración continua del proyecto.

Puedes leer más sobre las herramientas y bibliotecas utilizadas en este proyecto [aquí](bibtools.md).

Cabe mencionar que aunque Grunt sea mi archivo de configuración principal, depende mucho de varias tareas declaradas en `package.json`, dichas tareas se muestran a continuación:

```
  "scripts": {
    "test":"nyc mocha test/tests.js",
    "int-test":"nyc mocha test/integration.test.js",
    "unit-test": "nyc mocha test/texCompiler.test.js",
    "report-coverage": "nyc report --reporter=text-lcov > coverage.lcov",
    "start": "nodemon src/index.js"
  },
```
Los tests se lanzan con nyc, dicho comando corresponde a la herramienta para analizar la cobertura del proyecto: [istanbul](https://istanbul.js.org/).