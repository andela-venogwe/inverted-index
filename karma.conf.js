// Karma configuration
// Generated on Fri Dec 09 2016 07:10:21 GMT+0100 (WAT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/public/js/*.js',
      'src/jasmine/spec/*.js'
    ],


    // list of files to exclude
    exclude: [
      'src/public/js/app.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/public/js/Inverted-index.js': ['coverage'],
      './jasmine/spec/inverted-index-test.js': ['coverage']
    },

    // // Which plugins to enable
    // plugins: [
    //   'karma-chrome-launcher',
    //   'karma-coverage',
    //   'karma-coveralls',
    //   'karma-jasmine',
    //   'karma-spec-reporter',
    //   'karma-verbose-reporter',
    // ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage', 'coveralls', 'verbose'],

    // web server port
    port: 9876,


    proxies: {
      '/src/public/uploads/': '/src/public/uploads/',
    },
    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    
    // enable / disable watching file on file change
    autoWatch: true,


    // Others
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // start these browsers
    browsers: process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
