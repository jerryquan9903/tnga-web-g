var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var workRouter = require('./routes/work');
var contactRouter = require('./routes/contact');
var projectRouter = require('./routes/projects');
var articleRouter = require('./routes/article');
var adminRouter = require('./routes/admin');
var admin_aboutRouter = require('./routes/admin-about');
var admin_articleRouter = require('./routes/admin-article');

var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/work', workRouter);
app.use('/contact', contactRouter);
app.use('/projects', projectRouter);
app.use('/article', articleRouter);
app.use('/admin', adminRouter);
app.use('/admin-about', admin_aboutRouter);
app.use('/admin-article', admin_articleRouter);

/*
app.post('/admin', function(req, res) {
  console.log(req.body.id, req.body.pass);
  res.sendStatus(200);
});
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error pagey

  res.status(err.status || 500);
  res.render('error');
});

/*
app.listen(9000, function(err) {
  if (err) {
    throw err
  }

  console.log('Server started on port 9000.')
});
*/

module.exports = app;
