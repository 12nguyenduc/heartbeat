var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'georgianna.gorczany6@ethereal.email',
        pass: 'dYqj2udfd3ga9AUwZj'
    }
});
const axios = require('axios');

global.lastPing = new Date().getTime();

var app = express();
var cron = require('node-cron');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const TIME_OVER = 2*60*1000/16;

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// cron.schedule(`*/2 * * * * *`, () => {
//     console.log('ping');
//         axios.get('http://localhost:3000/')
//             .then(function (response) {
//                 // handle success
//                 console.log(response.status);
//             })
//             .catch(function (error) {
//                 // handle error
//                 console.log(error);
//             })
//             .then(function () {
//                 // always executed
//             });
//
// });


cron.schedule(`*/${TIME_OVER} * * * * *`, () => {
    console.log('running a task every two minutes');
    console.log(new Date().getTime()-global.lastPing)
    if((new Date().getTime() - global.lastPing)>TIME_OVER){
        try{
            axios.post('https://hooks.slack.com/services/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', {text: 'Cảnh báo dịch vụ đọc tin nhắn'})
                .then(function (response) {
                    // handle success
                    console.log(response.status);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });

        }catch (e) {

        }
        try {
            var mailOptions = {
                to: 'ictduc@gmail.com, lamvt@tima.vn, ducnv@tima.vn',
                subject: 'Cảnh báo tin nhắn bank đang offline!',
                text: 'Cảnh báo tin nhắn bank đang offline! Vui lòng kiểm tra lại!'
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }catch (e) {

        }

    }
});

module.exports = app;
