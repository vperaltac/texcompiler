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
  grunt.registerTask('test', ['run:npm_test']);

  // Tarea por defecto: genera documentacion, ejecuta tests y limpia archivos generados
  grunt.registerTask('default', ['docco','run:npm_test','clean']);
};