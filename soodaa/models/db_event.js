//db_event.js
var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');

var pool = mysql.createPool(db_config);
var eventUrl = "http://52.68.92.194/images/uploads/event/";

exports.addEvent = function(datas, done) {
    pool.getConnection(function(err ,conn){
        if(err) {
            logger.error('err',err);
            done(err);
            return;
        }
        var sql = "insert into event(eventTitle, eventPicture) values(?, ?)";
        conn.query(sql, datas, function(err, row){
            if(err) {
                logger.error('err', err);
                done(err);
                return;
            }
            var success = false;
            if(row.affectedRows==1){
                success = true;
            }
            done(null, success);
            conn.release();
        })
    })
}

exports.getEvent = function(done){
    pool.getConnection(function(err ,conn){
        if(err) {
            logger.error('err',err);
            done(err);
            return;
        }
        var sql = "select eventPicture, DATE_FORMAT(eventRegdate, '%Y%m%d') date from event where eventIsDeleted=0";
        conn.query(sql, [], function(err, row){
            if(err) {
                logger.error('err', err);
                done(err);
                return;
            }
            logger.debug('row',row);
            if(row.length>0){
                var data = {
                    "isEvent" : 1,
                    "imageUrl" : eventUrl + row[0].eventPicture,
                    "date" : row[0].date
                }
            } else {
                var data = {
                    "isEvent" : 0
                }
            }
            done(null, data);
            conn.release();

        })
    })
}