'use strict';
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fs=require('fs');
let bodyParser = require('body-parser');
let app = express();



let log4js=require('log4js');
let log4jsConf=require('./config/logConf.json');
log4js.configure(log4jsConf);
let logg = log4js.getLogger('log_date');
app.use(log4js.connectLogger(logg, { level: 'auto' }));

let rsclient=require('./lib/rsclient.js');
let rtcp=require('./config/rtcp.json');
rsclient(rtcp);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: "5mb", type:'application/json'}));
app.use(bodyParser.urlencoded({extended: true,limit:'5120kb', parameterLimit:50000}));
let files=fs.readdirSync('./routes');
for(let ff in files){
    let fileType=files[ff].substring(files[ff].lastIndexOf('.')+1,files[ff].length);
    if(fileType==='js'){
        let name=files[ff].replace('.js','');
        app.use('/'+name,require('./routes/'+name));
    }
}
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
