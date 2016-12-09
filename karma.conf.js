// Karma configuration
// Generated on Fri Dec 02 2016 09:50:30 GMT+0100 (WAT)

module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './src/public/js/Inverted-Index-Utility.js',
      './src/public/js/Inverted-index.js',
      './src/jasmine/spec/inverted-index-test.js',
    ],

    // list of files to exclude
    exclude: [
      './coverage/',
    ],


    // preprocess matching files before serving them to the browser
    preprocessors: {
      './src/public/js/Inverted-Index-Utility.js': 'coverage',
      './src/public/js/Inverted-index.js': 'coverage',
      './src/jasmine/spec/inverted-index-test.js': 'coverage',
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage', 'coveralls', 'verbose'],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    proxies: {
      '/src/public/uploads/': 'http://localhost:9876/src/public/uploads/'
    },

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


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
  });
};