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

    clean: ['data/nuevo','data/test_user/out/*'],

    copy: {
      src: {
        src: 'data/test_user/src/ejemplo.tex',
        dest: 'data/test_delete/src/ejemplo.tex',
      },
      out: {
        src: 'data/test_user/out/ejemplo.pdf',
        dest: 'data/test_delete/out/ejemplo.pdf',
      }
    },

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

      pm2_start_index:{
        cmd: 'pm2',
        args: ['start','src/index.js','--name','texCompiler']
      },

      pm2_start_worker:{
        cmd: 'pm2',
        args: ['start','src/worker.js','--name','worker','-i','4']
      },

      pm2_reload:{
        cmd: 'pm2',
        args: ['restart','texCompiler']
      },

      pm2_restart:{
        cmd: 'pm2',
        args: ['reload','texCompiler']
      },

      pm2_stop_index:{
        cmd: 'pm2',
        args: ['stop','texCompiler']
      },

      pm2_stop_workers:{
        cmd: 'pm2',
        args: ['stop','worker']
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

  grunt.loadNpmTasks('grunt-contrib-copy');

  // Carga el plugin para ejecutar comandos de la terminal
  grunt.loadNpmTasks('grunt-run');

  // Tarea para ejecutar todos los tests
  grunt.registerTask('test', ['run:npm_test','clean']);

  // Tarea para ejecutar los tests unitarios
  grunt.registerTask('unit-test',['run:npm_unit_test','clean'])

  // Tarea para ejecutar los tests de integración
  grunt.registerTask('int-test',['copy','run:npm_int_test','clean'])

  // Tarea por defecto: genera documentacion, ejecuta tests y limpia archivos generados
  grunt.registerTask('doc',['docco']);

  // Tarea para lanzar el servicio con pm2
  grunt.registerTask('start',['run:pm2_start_index','run:pm2_start_worker']);

  // Tarea para parar el servicio con pm2
  grunt.registerTask('stop',['run:pm2_stop_index','run:pm2_stop_workers']);

  // Tarea para recargar el servicio con pm2
  grunt.registerTask('reload',['run:pm2_reload']);

  // Tarea para reiniciar el servicio con pm2
  grunt.registerTask('restart',['run:pm2_restart']);

  grunt.registerTask('report-coverage',['run:npm_report_coverage']);
};