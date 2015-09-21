//db_notice.js
var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');


var pool = mysql.createPool(db_config);

exports.list = function(datas, done) {
    pool.getConnection(function(err, conn) {
        if(err) logger.error('err',err);
        var sql1 = "select count(*) cnt from notice";
        conn.query(sql1, [], function(err, rows){
            if(err) logger.error('err', err);
            logger.debug('rows',rows);
            var cnt = rows[0].cnt;
            var begin = datas[0]-1;
            var size = datas[1];
            var sql2 =
                "SELECT noticeNum, m.memberName, noticeContent, noticeContent, DATE_FORMAT(noticeRegdate, '%Y-%m-%d %H:%i:%s') noticeRegdate " +
                "FROM notice n, member m where noticeIsDeleted = 0 and n.memberId = m.memberId " +
                "order by noticeRegdate desc limit ?, ?";
            conn.query(sql2, [begin, size], function(err,rows) {
                if(err) logger.error('err',err);
                logger.debug('rows',rows);
                conn.release();
                done(rows);
            });
        })
    })
};

exports.read = function(datas, done) {
    pool.getConnection(function(err, conn) {
        if(err) logger.error('err',err);
        var sql = "SELECT m.memberName, noticeContent FROM notice n, member m where n.noticeIsDeleted=0 and n.memberId = m.memberId and n.noticeNum =?";
        conn.query(sql, datas, function(err, rows) {
            if(err) logger.error('err',err);
            logger.debug('rows',rows);
            conn.release();
            done(rows[0]);
        })
    })
};

exports.write = function(datas, done) {
    pool.getConnection(function(err, conn) {
        if(err) logger.error('err',err);
        var sql = "INSERT INTO notice (memberId, noticeContent) VALUES (?, ?)";
        conn.query(sql, datas, function(err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = 0;
            if (row.affectedRows == 1) {
                success = 1;
            }
            done(success);
            conn.release();
        })
    })
};

exports.modify = function(datas, done) {
    pool.getConnection(function(err, conn) {
        if(err) logger.error('err', err);
        var sql = "UPDATE notice SET noticeContent=?, noticeModifydate=now() where noticeNum=?";
        conn.query(sql, datas, function(err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = 0;
            if (row.affectedRows == 1) {
                success = 1;
            }
            done(success);
            conn.release();
        })
    })
};

exports.delete = function(datas, done) {
    pool.getConnection(function(err, conn) {
        if(err) logger.error('err', err);
        var sql = "UPDATE notice SET noticeIsDeleted=1 where noticeNum=?";
        conn.query(sql, datas, function(err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = 0;
            if (row.affectedRows == 1) {
                success = 1;
            }
            done(success);
            conn.release();
        })
    })
};

function changeTime(inputDate) {
    var regdate = new Date(inputDate);
    var now = new Date();
    var time = parseInt((now - regdate) / (1000 * 60));

    if (time < 60) {
        return time + "분 전";
    }
    else if (((time / 60) / 24) > 1) {
        return inputDate;
    }
    else if (time >= 60) {
        return parseInt(time / 60) + "시간 전";
    }
}