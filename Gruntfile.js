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

    clean:{
      nuevo: ['data/nuevo'],
      out: ['data/test_user/out/ejemplo*', '!data/test_user/out/*.pdf'],
      src: ['data/test_user/src/ejemplo*', '!data/test_user/src/*.tex'],
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'views',
          src: ['*.css', '!*.min.css'],
          dest: 'views',
          ext: '.min.css'
        }]
      }
    },

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

    shell: {
      options: { stdout: true },
      create: 'heroku apps:create --region eu texcompiler',
      cloudamqp: 'heroku addons:create cloudamqp:lemur',
      bpnodejs: 'heroku buildpacks:set heroku/nodejs',
      bptex: 'heroku buildpacks:add https://github.com/vperaltac/heroku-buildpack-tex',
      push: 'git push heroku master'
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

      vagrant_up:{
        cmd: 'vagrant',
        args: ['up']
      },

      vagrant_halt:{
        cmd: 'vagrant',
        args: ['halt']
      },

      provision:{
        cmd: 'vagrant',
        args: ['provision']
      },

      pm2_start:{
        cmd: 'pm2-runtime',
        args: ['start','ecosystem.config.js','--env', 'production']
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

  grunt.loadNpmTasks('grunt-contrib-cssmin');

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
  grunt.registerTask('start',['run:pm2_start']);

  // Tarea para recargar el servicio con pm2
  grunt.registerTask('reload',['run:pm2_reload']);

  // Tarea para reiniciar el servicio con pm2
  grunt.registerTask('restart',['run:pm2_restart']);

  grunt.registerTask('report-coverage',['run:npm_report_coverage']);

  grunt.registerTask('deploy',['shell']);

  grunt.registerTask('vagrant-up',['run:vagrant_up']);

  grunt.registerTask('vagrant-halt',['run:vagrant_halt']);

  grunt.registerTask('provision',['run:provision']);
};