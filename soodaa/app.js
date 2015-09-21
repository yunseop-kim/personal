//수다
var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var client = redis.createClient();
client.select(8);
var moment = require('moment');
var schedule = require('node-schedule');

var routes = require('./routes/index');
var users = require('./routes/users');
var member = require('./routes/member');
var baby = require('./routes/baby');
var choice = require('./routes/choice');
var todays = require('./routes/todays');
var review = require('./routes/review');
var notice = require('./routes/notice');
var admin = require('./routes/admin');
var gcm = require('./routes/gcm');
var web = require('./routes/web');
var event = require('./routes/event');
var webtest = require('./routes/webtest');
var ranking = require('./routes/ranking');

var rank = require('./etc/rank');

var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-domain-middleware'));

app.use(multer({
    dest: './public/images/uploads/',
    rename: function(fieldname, filename) {
        return moment().format("YYYY-MM-DD")+ '_' + filename.replace(/\s/g,'').toLowerCase()+ '_' + Date.now();
    }
}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
        host: 'localhost',
        port: 6739,
        client: client,
        ttl: 3600,
        disableTTL: true
    })
}));

app.use('/', routes);
app.use('/users', users);
app.use('/member', member);
app.use('/baby', baby);
app.use('/choice', choice);
app.use('/todays', todays);
app.use('/review', review);
app.use('/notice', notice);
app.use('/admin', admin);
app.use('/gcm', gcm);
app.use('/web', web);
app.use('/event', event);
app.use('/webtest', webtest);
app.use('/ranking', ranking);

app.use(function errorHandler(err, req, res, next) {
  console.log('error on request %d %s %s', process.domain.id, req.method, req.url);
  console.log(err.stack);
  // res.send(500, "Something bad happened. :(");
  // res.status(500).send("에러 발생 error = " + err);
  var temp = err.stack;
  var error = temp.substring(0, temp.indexOf('\n'));
  res.status(500).json({'error' : error});
  if(err.domain) {
    //you should think about gracefully stopping & respawning your server
    //since an unhandled error might put your application into an unknown state
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var http = require('http');
app.set('port', 3000);
var server = http.createServer(app);
server.listen(app.get('port'));
console.log('서버가 ' + app.get('port') + '에서 실행중입니다.');


module.exports = app;

