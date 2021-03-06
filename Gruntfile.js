module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['public/client/*.js'],
        dest:'public/dist/app_concat.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    // nodemon: {
    //   dev: {
    //     script: 'server.js'
    //   }
    // },

    uglify: {
      build: {
        src:  'public/dist/app_concat.js',
        dest: 'public/dist/app_concat.min.js'
      }
    },

    jshint: {
      files: [
       'public/client/*.js',
       'app/**/*.js',
       '*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js',
          'app/db/*'
        ]
      }
    },

    cssmin: {
      build : {
        src :'public/style.css',
        dest:'public/dist/style.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command : 'git push azure master'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  // grunt.loadNpmTasks('grunt-nodemon');

  // grunt.registerTask('server-dev', function (target) {
  //   // Running nodejs in a different process and displaying output on the main console
  //   var nodemon = grunt.util.spawn({
  //        cmd: 'grunt',
  //        grunt: true
  //        ,args: 'nodemon'
  //   });
  //   nodemon.stdout.pipe(process.stdout);
  //   nodemon.stderr.pipe(process.stderr);

  //   grunt.task.run([ 'watch' ]);
  // });


  grunt.registerTask('server-prod', function (target) {
    // Running nodejs in a different process and displaying output on the main console

    grunt.task.run([ 'build' ]);
    grunt.task.run([ 'test' ]);
    grunt.task.run([ 'shell' ]);
  });
  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.log.write('prod')
      // add your production server task here
      grunt.task.run([ 'server-prod' ]);
    } else {
      grunt.log.write('dev')
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
  ]);

  grunt.registerTask('default',[
  ]);


};
