const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const index = require('./routes/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'src/public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/** app.use(express.static(path.join(__dirname, 'public')));
 * override the static method above using middleware sass
 * adding the sass middleware The reason is that 
 * we first want sass to compile any sass files that 
 * has changed, only then serve them (which is done by express.static).
 */ 
app.use(
  sass({
    src: __dirname + '/src/sass', 
    dest: __dirname + '/src/public/stylesheets',
    outputStyle: 'compressed',
    prefix:  '/public/stylesheets',
    debug: true,       
  })
); 

// The static middleware must come after the sass middleware
app.use(express.static( path.join( __dirname, 'src/public' ) ) );

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  'use strict';
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  'use strict';
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
