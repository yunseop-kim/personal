//db_gcm.js
var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');

var pool = mysql.createPool(db_config);

var memberUrl = "http://52.68.92.194/images/uploads/member/";

exports.chat = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql1 = "insert into gcm (senderId, receiverId, chatContent, type) values(?,?,?,1)";
        conn.query(sql1, datas, function (err, row) {
            logger.debug('row',row);

            if (err) logger.error('err', err);
            if (row.affectedRows == 1) {
                var sql2 = "select memberGCMRegId from member where memberId=?";
                conn.query(sql2, datas[1], function (err, regId) {
                    if (err) logger.error('err', err);
                    var sql3 = "select memberName from member where memberId=?";
                    conn.query(sql3, datas[0], function (err, Name) {
                        if (err) logger.error('err', err);
                        var data = {
                            "regId": regId[0].memberGCMRegId,
                            "memberName": Name[0].memberName
                        }
                        conn.release();
                        done(data);
                    })
                })
            }
        })
    })
}


exports.getMessage = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        logger.debug('getMessage 시작!');
        var sql1 = "select senderId, chatContent, DATE_FORMAT(gcmDate, '%Y-%m-%d %H:%i:%s') gcmDate from gcm where receiverId=? and gcmFlag=0 and type=1";
        conn.query(sql1, datas, function (err, row) {
            if (err) logger.error('err', err);
            if (row.length == 0) {
                var success = 2;
                conn.release();
                done(null, success);
            } else {
                logger.debug('row',row);
                var sql2 = "select memberName, memberPicture from member where memberId=?";
                conn.query(sql2, row[0].senderId, function (err, sender) {

                    if (err) logger.error('err', err);
                    var data = [];
                    for (var i = 0; i < row.length; i++) {
                        data[i] = {
                            "memberId": row[i].senderId,
                            "memberName": sender[0].memberName,
                            "memberPicture": memberUrl + sender[0].memberPicture,
                            "messageContent": row[i].chatContent,
                            "messageDate": row[i].gcmDate
                        }
                    }
                    var sql3 = "update gcm set gcmFlag=1 where receiverId=? and type=1"
                    conn.query(sql3, datas, function (err, rows) {

                        if (err) logger.error('err', err);
                        var success = 0;
                        if (rows.affectedRows >= 1) {
                            success = 1;
                            logger.debug('datad', data);
                            conn.release();
                            done(data, success)
                        }
                    })
                })
            }
        })
    })
}


exports.getReviewLike = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql1 = "select senderId, DATE_FORMAT(gcmDate, '%Y-%m-%d %H:%i:%s') gcmDate, tmpIndex from gcm where receiverId=? and gcmFlag=0 and type=2";
        conn.query(sql1, datas, function (err, row) {
            if (err) logger.error('err', err);
            if (row.length == 0) {
                var success = 2;
                conn.release();
                done(null, success);
            } else {
                var sql2 = "select memberName, memberPicture from member where memberId=?";
                conn.query(sql2, row[0].senderId, function (err, sender) {
                    if (err) logger.error('err', err);
                    var data = [];
                    for (var i = 0; i < row.length; i++) {
                        data[i] = {
                            "memberId": row[i].senderId,
                            "memberName": sender[0].memberName,
                            "memberPicture": memberUrl + sender[0].memberPicture,
                            "reviewNum": row[i].tmpIndex,
                            "notiDate": row[i].gcmDate
                        }
                    }
                    var sql3 = "update gcm set gcmFlag=1 where receiverId=? and type=2"
                    conn.query(sql3, datas, function (err, rows) {
                        if (err) logger.error('err', err);
                        var success = 0;
                        if (rows.affectedRows >= 1) {
                            success = 1;
                        }
                        conn.release();
                        done(data, success)
                    })
                })
            }
        })
    })
}

exports.getReviewReply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql1 = "select senderId, DATE_FORMAT(gcmDate, '%Y-%m-%d %H:%i:%s') gcmDate, tmpIndex from gcm where receiverId=? and gcmFlag=0 and type=3";
        conn.query(sql1, datas, function (err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            if (row.length == 0) {
                var success = 2;
                conn.release();
                done(null, success);
            } else {
                var sql2 = "select memberName, memberPicture from member where memberId=?";
                conn.query(sql2, row[0].senderId, function (err, sender) {
                    if (err) logger.error('err', err);
                    var data = [];
                    for (var i = 0; i < row.length; i++) {
                        data[i] = {
                            "memberId": row[i].senderId,
                            "memberName": sender[0].memberName,
                            "memberPicture": memberUrl + sender[0].memberPicture,
                            "reviewNum": row[i].tmpIndex,
                            "notiDate": row[i].gcmDate
                        }
                    }
                    var sql3 = "update gcm set gcmFlag=1 where receiverId=? and type=3"
                    conn.query(sql3, datas, function (err, rows) {
                        if (err) logger.error('err', err);
                        var success = 0;
                        if (rows.affectedRows >= 1) {
                            success = 1;
                        }
                        conn.release();
                        done(data, success)
                    })
                })
            }
        })
    })
}

exports.getChoiceReply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql1 = "select senderId, DATE_FORMAT(gcmDate, '%Y-%m-%d %H:%i:%s') gcmDate, tmpIndex from gcm where receiverId=? and gcmFlag=0 and type=4";
        conn.query(sql1, datas, function (err, row) {
            if (err) logger.error('err', err);
            if (row.length == 0) {
                var success = 2;
                conn.release();
                done(null, success);
            } else {
                var sql2 = "select memberName, memberPicture from member where memberId=?";
                conn.query(sql2, row[0].senderId, function (err, sender) {
                    if (err) logger.error('err', err);
                    var data = [];
                    for (var i = 0; i < row.length; i++) {
                        data[i] = {
                            "memberId": row[i].senderId,
                            "memberName": sender[0].memberName,
                            "memberPicture": memberUrl + sender[0].memberPicture,
                            "reviewNum": row[i].tmpIndex,
                            "notiDate": row[i].gcmDate
                        }
                    }
                    var sql3 = "update gcm set gcmFlag=1 where receiverId=? and type=4"
                    conn.query(sql3, datas, function (err, rows) {
                        if (err) logger.error('err', err);
                        var success = 0;
                        if (rows.affectedRows >= 1) {
                            success = 1;
                        }
                        conn.release();
                        done(data, success)
                    })
                })
            }
        })
    })
}


exports.choice = function(data, done) {
    pool.getConnection(function (err, conn) {
        if(err){
            logger.error('err',err);
            done(err);
        } else {
            var sql = "select b.memberGCMRegId from choiceListView as a, " +
                "member as b where voteNum=? and a.memberId=b.memberId";
            conn.query(sql, data, function (err, row) {
                if (err) {
                    logger.error('err', err);
                    done(err);
                } else {
                    logger.debug('row',row);
                    done(null, row[0].memberGCMRegId);
                    conn.release();
                }
            })
        }
    })
}

exports.review = function(data, done) {
    pool.getConnection(function (err, conn) {
        if(err){
            logger.error('err',err);
            done(err);
        } else {
            var sql = "select  b.memberGCMRegId from reviewListView as a, member as b where reviewNum=? " +
                "and a.memberId=b.memberId";
            conn.query(sql, data, function (err, row) {
                if (err) {
                    logger.error('err', err);
                    done(err);
                } else {
                    logger.debug('row',row);
                    done(null, row[0].memberGCMRegId);
                    conn.release();
                }
            })
        }

    })
}