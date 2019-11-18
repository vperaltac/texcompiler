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