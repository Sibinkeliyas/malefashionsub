var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const {v4:uuidv4} = require('uuid')


var indexRouter = require('./routes/admin');
var usersRouter = require('./routes');

var app = express();


//database
const connection = require('./config/connection')
const collection = require('./config/collection')


//connection
connection.connect((err)=>{
  if(err) {
    console.log(err);
  } else{
    console.log('database connected');
  }
})


// session
app.use(session({
  secret : uuidv4(),
  resave:false,
  saveUninitialized:true,
  cookie: { maxAge: 6000000000 },
}))


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('views', [__dirname + '/views/user', __dirname + '/views/admin'])
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// file object
// app.use(fileUpload())

// cache

app.use(function(req, res, next) {
  if (!req.user) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
  }
  next();
});


app.use('/', usersRouter);
app.use('/admin', indexRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  let profileStatus,adminlog
  if(req.session.user){
    profileStatus = true
  } else if(req.session.admin){
    adminlog = true
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
 
  res.render('error',{profileStatus,adminlog});
});

// port

const PORT = process.env.PORT||3000

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`);
})

module.exports = app;
