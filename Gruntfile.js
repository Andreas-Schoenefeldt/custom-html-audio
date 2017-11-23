module.exports = function(grunt) {
    // Do grunt-related things in here

    'use strict';

    // single point of repository information
    var repository = {
        name: "custom-html-audio"
        , description: "A custom html5 audio wrapper, that allows styling and functional changes."
        , version: "1.0.0" // The current Version
        , license : 'MIT'
        , authors: [
            "Andreas Schönefeldt <schoenefeldt.andreas@gmail.com>"
        ]
        , repository : 'git+https://github.com/Andreas-Schoenefeldt/custom-html-audio.git'
    };

    // define the current versions here

    var gruntConf = {
        pkg: grunt.file.readJSON('package.json')

        , watch: { // tracks changes of the watched files and rerunns the generation commands for development convenience
            options: {
                livereload: true
            }

            , less : {
                files : ['src/less/**/*.less'],
                tasks: ['less', 'autoprefixer']
            }

            , uglify : {
                files: ['src/js/*.js'],
                tasks: ['uglify:prd']
            }
        }

        , less: {
            options:{
                paths: [""],
                sourceMap: true
            },
            dev: {
                files: {
                    'dist/css/basic.css': 'src/less/basic.less'
                }
            }
        }

        , autoprefixer: { // adds vendor prefixes to the css
            dev : {
                expand: true,
                flatten: true,
                src: 'dist/css/*.css', // -> src/css/file1.css, src/css/file2.css
                dest: 'dist/css/' // -> dest/css/file1.css, dest/css/file2.css
            }
        }

        , uglify: { // minify and optimize js files
            options : {
                screwIE8 : true
                , banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n *  <%= pkg.description %>\n */\n'
            }
            , prd: {
                files: {
                    // '../static/js/global-nav-1.1.1.min.js': ['../static/js/global-nav-1.1.1.js']
                }
            }
        }
    };

    gruntConf.uglify.prd.files['dist/js/custom-html-audio.js'] = ['src/js/custom-html-audio.js'];

    var init = function(){
        // writing the package files
        grunt.log.writeln( 'Starting file compilation...'['yellow']);
        grunt.log.writeln(('  > Package v. ' + gruntConf.pkg.version)['green'].bold);
        grunt.log.writeln( '');

        grunt.log.writeln( '  > Rewriting Package Files...'['green'].bold);
        grunt.log.writeln(('    | package.json')['yellow'].bold);
        grunt.file.write('package.json', JSON.stringify(gruntConf.pkg, null, 2));

        grunt.log.writeln(('    | bower.json')['yellow'].bold);
        grunt.file.write('bower.json', JSON.stringify(bower, null, 2));

        // grunt.log.writeln(('    | composer.json')['yellow'].bold);
        // grunt.file.write('composer.json', JSON.stringify(composer, null, 2));
    };

    // bower update
    var bower = grunt.file.readJSON('bower.json');
    bower.version = repository.version;
    bower.license = repository.license;
    bower.authors = repository.authors;
    bower.description = repository.description;
    bower.repository = repository.repository;
    bower.main = [];
    for (var file in gruntConf.uglify.prd.files) {
        bower.main.push(file);
    }

    // filling the variables
    gruntConf.pkg.version = repository.version;
    gruntConf.pkg.license = repository.license;
    gruntConf.pkg.name = repository.name;
    gruntConf.pkg.description = repository.description;
    gruntConf.pkg.repository = repository.repository;

    // Project configuration.
    grunt.initConfig(gruntConf);

    // load the grunt modules
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // compilation and basic watch task.
    grunt.registerTask('default', 'JS Minification', function() {
        init();
        grunt.task.run('less', 'autoprefixer', 'uglify', 'watch');
    });

};
