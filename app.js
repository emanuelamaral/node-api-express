const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose'); // import

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const isAuthorized = require('./middleware/isAuthorized');

require("dotenv").config();

var app = express();

// Configurar a conexão
mongoose
  .connect("mongodb+srv://amaral2018:uflTDyDgbXWECP02@cluster0.lhxtim3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {})
  .then(() => {
    console.log("MongoDB conectado, Oba!!!");
  })
  .catch( (err) => {
    console.log("MongoDB não conectado");
    console.log(err);
  });



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Definição dos rotas da aplicação
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', require('./routes/auth'));
//app.use('/produtos', isAuthorized, require('./routes/produtos'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
