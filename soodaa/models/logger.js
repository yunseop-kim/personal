var winston = require('winston');
var moment = require('moment');
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level:'info',
            colorize: true
        }),
        new winston.transports.DailyRotateFile({
            level:'debug',
            filename: 'logs/app-debug',
            maxsize: 1000 * 1024,
            datePattern: '.yyyy-MM-dd.log',   // app-debug.yyyy-MM-dd.log 파일로 저장됨
            timestamp: function() {return moment().format("YYYY-MM-DD HH:mm:ss.SSS"); }
        })
    ]
});


module.exports = logger;