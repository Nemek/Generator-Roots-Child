module.exports = function( grunt ) {
	'use strict';

	// Load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration
	grunt.initConfig( {
		pkg:    grunt.file.readJSON( 'package.json' ),
		jshint: {
			browser: {
				all: [
					'assets/js/**/*.js',
					'assets/js/test/**/*.js'
				],
				options: {
					jshintrc: '.jshintrc'
				}
			},
			grunt: {
				all: [
					'Gruntfile.js'
				],
				options: {
					jshintrc: '.gruntjshintrc'
				}
			}
		},
		// uglify to concat, minify, and make source maps
		uglify: {
			plugins: {
				options: {
					sourceMap: 'assets/js/plugins.js.map',
					sourceMappingURL: 'plugins.js.map',
					sourceMapPrefix: 2,
					banner: '/*! <%= pkg.title %> - Plugins - v<%= pkg.version %> - <%= date_formatted %>\n' +
						' * <%= pkg.name %>\n' +
						' * Copyright (c) <%= year %>;' +
						' * Licensed GPLv2+' +
						' */\n',
				},
				files: {
					'assets/js/plugins.min.js': [
						'assets/js/source/plugins.js',
						// 'assets/js/vendor/yourplugin/yourplugin.js',
					]
				}
			},
			main: {
				options: {
					sourceMap: 'assets/js/main.js.map',
					sourceMappingURL: 'main.js.map',
					sourceMapPrefix: 2,
					banner: '/*! <%= pkg.title %> - v<%= pkg.version %> - <%= date_formatted %>\n' +
						' * <%= pkg.name %>\n' +
						' * Copyright (c) <%= year %>;' +
						' * Licensed GPLv2+' +
						' */\n',
				},
				files: {
					'assets/js/main.min.js': [
						'assets/js/source/main.js'
					]
				}
			}
		},
		test:   {
			files: ['assets/js/test/**/*.js']
		},
		<% if ('Sass' === css_type) { %>
		compass: {
			options: {
				sassDir: 'assets/css/sass',
				cssDir: 'assets/css',
				generatedImagesDir: 'assets/img/.tmp/generated',
				imagesDir: 'assets/img',
				javascriptsDir: 'assets/js',
				fontsDir: 'assets/css/fonts',
				importPath: 'bower_components',
				httpImagesPath: 'assets/img',
				httpGeneratedImagesPath: 'assets/img/generated',
				httpFontsPath: 'css/fonts',
				relativeAssets: true
			},
			dist: {
				options: {
					generatedImagesDir: 'assets/img/dist/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'assets/css/',
					src: '{,*/}*.css',
					dest: 'assets/css/'
				}]
			}
		},
		<% } else if ('LESS' === css_type) { %>
		less:   {
			all: {
				files: {
					'assets/css/main.css': 'assets/css/less/main.less'
				}
			}
		},
		<% } %>
		cssmin: {
			options: {
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %> - <%= date_formatted %>\n' +
					' * <%= pkg.name %>\n' +
					' * Copyright (c) <%= year %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			minify: {
				expand: true,
				cwd: 'assets/css/',
				src: ['main.css'],
				dest: 'assets/css/',
				ext: '.min.css'
			}
		},
		imagemin: {
			dist: {
				options: {
					optimizationLevel: 7,
					progressive: true
				},
				files: [{
					expand: true,
					cwd: 'assets/img',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: 'assets/img/dist'
				}]
			}
		},
		version: {
			options: {
				file: 'lib/scripts.php',
				css: 'assets/css/main.min.css',
				cssHandle: '<%= prefix %>_main',
				js: 'assets/js/main.min.js',
				jsHandle: '<%= prefix %>_scripts'
			}
		},
		watch:  {
			options: {
				livereload: true
			},<% if ('Sass' === css_type) { %>
			compass: {
				files: ['assets/css/{,*/}*.{scss,sass}'],
				tasks: ['compass:server', 'autoprefixer', 'cssmin']
			},<% } else if ('LESS' === css_type) { %>
			less: {
				files: ['assets/css/less/*.less'],
				tasks: ['LESS', 'cssmin'],
				options: {
					debounceDelay: 500
				}
			},<% } else { %>
			styles: {
				files: ['assets/css/src/*.css'],
				tasks: ['autoprefixer', 'cssmin'],
				options: {
					debounceDelay: 500
				}
			},<% } %>
			scripts: {
				files: ['assets/js/**/*.js', 'assets/js/vendor/**/*.js'],
				tasks: ['jshint', 'uglify'],
				options: {
					debounceDelay: 500
				}
			},
			markup: {
				files: ['**/*.php', '**/*.html'],
				livereload: true
			}
		},
		// deploy via rsync
		deploy: {
			options: {
				src: "./",
				args: ["--verbose"],
				exclude: ['.git*', 'node_modules', '.sass-cache', 'Gruntfile.js', 'package.json', '.DS_Store', 'README.md', 'config.rb', '.jshintrc', '.gruntjshintrc', '.editorconfig'],
				recursive: true,
				syncDestIgnoreExcl: true
			},
			staging: {
				options: {
					dest: "~/path/to/theme",
					host: "user@host.com"
				}
			},
			production: {
				options: {
					dest: "~/path/to/theme",
					host: "user@host.com"
				}
			}
		}
	} );

	// Default task.
	<% if ('Sass' === css_type) { %>
	grunt.registerTask( 'default', ['jshint', 'uglify', 'compass', 'autoprefixer', 'cssmin', 'version'] );
	<% } else if ('LESS' === css_type) { %>
	grunt.registerTask( 'default', ['jshint', 'uglify', 'less', 'autoprefixer', 'cssmin', 'version'] );
	<% } else { %>
	grunt.registerTask( 'default', ['jshint', 'uglify', 'autoprefixer', 'cssmin', 'version'] );
	<% } %>

	grunt.registerTask( 'dev', ['watch'] );

	grunt.util.linefeed = '\n';
};