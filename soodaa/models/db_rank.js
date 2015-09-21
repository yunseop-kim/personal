var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');

var pool = mysql.createPool(db_config);

exports.weekJob = function(done) {
    pool.getConnection(function(err, conn){
        if(err) {
            logger.error('err', err);
            done(err);
            return;
        }
        var sql = "update member set rankWeek = 0";
        conn.query(sql, [], function(err, rows) {
            if(err) {
                logger.error('err', err);
                done(err);
                return;
            }
            if(rows.affectedRows>=1){
                done(null);
            } else {
                done('err');
            }
            conn.release();
        })

    })
}


exports.monthJob = function(done) {
    pool.getConnection(function(err, conn){
        if(err) {
            logger.error('err', err);
            done(err);
            return;
        }
        var sql = "update member set rankMonth = 0";
        conn.query(sql, [], function(err, rows) {
            if(err) {
                logger.error('err', err);
                done(err);
                return;
            }
            if(rows.affectedRows>=1){
                done(null);
            } else {
                done('err');
            }
            conn.release();
        })

    })
}

exports.rankList = function(datas, done) {
    pool.getConnection(function(err, conn) {
        if(err) {
            logger.error('err', err);
            done(err);
            return;
        }
        if(datas==1){
            var sql = "select memberId, memberName, rankWeek as point from member where (@rownum:=0)=0 and rankWeek >= 1 order by rankWeek desc limit 0, 10"
        } else if(datas==2){
            var sql = "select memberId, memberName, rankMonth as point from member where (@rownum:=0)=0 and  rankMonth >= 1 order by rankMonth desc limit 0, 10"
        } else if(datas==3){
            var sql = "select memberId, memberName, rankTotal as point from member where (@rownum:=0)=0 and  rankTotal >= 1 order by rankTotal desc limit 0, 10"
        }
        conn.query(sql, [], function(err, rows){
            if(err){
                logger.error('err',err);
                done(err);
                return;
            }
            var datas = [];
            for(var i = 0; i<rows.length; i++){
                datas[i] = {
                    "rank": i+1,
                    "memberId" : rows[i].memberId,
                    "memberName" : rows[i].memberName,
                    "point" : rows[i].point

                }
            }
            logger.debug('datas',datas);

            done(null, datas);
            conn.release();
        })
    })

}