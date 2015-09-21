var schedule = require('node-schedule');
var db_rank = require('../models/db_rank');
var logger = require('./logger');


//var test = '* * * * *';
var week = '0 4 * * 0';
var month = '0 4 1 * *';



//var testJob = schedule.scheduleJob(test, function() {
//    console.log('*******')
//})


var weekJob = schedule.scheduleJob(week, function() {
    db_rank.weekJob(function(err){
        if(err){
            logger.error('err',err);
        } else {
            logger.info('DB rankWeek 초기화 성공!');
        }
    })
})


var monthJob = schedule.scheduleJob(month, function() {
    db_rank.monthJob(function(err){
        if(err){
            logger.error('err',err);
        } else {
            logger.info('DB monthWeek 초기화 성공!');
        }
    })
})

