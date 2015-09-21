//db_todays.js
var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');

var pool = mysql.createPool(db_config);
var todaysUrl = "http://52.68.92.194/images/uploads/todays/";
var memberUrl = "http://52.68.92.194/images/uploads/member/";


exports.list = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql1 = "select count(*) cnt from todays";
        conn.query(sql1, [], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            var cnt = rows[0].cnt;
            var size = datas[1] * 1;
            var begin = (datas[0] - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((datas[0] - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((datas[0] - 1) * size);
            var sql2 = "select todaysCareNum, todaysCareTitle, todaysCareThumbnail, todaysCareLikeCnt, " +
                "todaysCareReplyCnt, todaysCareHit from todaysListView " +
                "where todaysCareIsDeleted=0 order by todaysCareRegdate desc limit ?, ?";
            conn.query(sql2, [begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    data[i] = {
                        "todaysCareNum": rows[i].todaysCareNum,
                        "todaysCareTitle": rows[i].todaysCareTitle,
                        "todaysCareThumbnail": todaysUrl + rows[i].todaysCareThumbnail,
                        "todaysCareLikeCnt": rows[i].todaysCareLikeCnt,
                        "todaysCareReplyCnt": rows[i].todaysCareReplyCnt,
                        "todaysCareHit": rows[i].todaysCareHit
                    }
                }
                conn.release();
                done(data);
            });
        })
    })
};


exports.list_cate = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql1 = "select count(*) cnt from todays where todaysCareCategory=?";
        conn.query(sql1, datas[2], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            var cnt = rows[0].cnt;
            var size = datas[1] * 1;
            var begin = (datas[0] - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((datas[0] - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((datas[0] - 1) * size);
            var sql2 = "select todaysCareNum, todaysCareTitle, todaysCareThumbnail, todaysCareLikeCnt, " +
                "todaysCareReplyCnt, todaysCareHit from todaysListView " +
                "where todaysCareIsDeleted=0 and todaysCareCategory=? order by todaysCareRegdate desc limit ?, ?";
            conn.query(sql2, [datas[2], begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    data[i] = {
                        "todaysCareNum": rows[i].todaysCareNum,
                        "todaysCareTitle": rows[i].todaysCareTitle,
                        "todaysCareThumbnail": todaysUrl + rows[i].todaysCareThumbnail,
                        "todaysCareLikeCnt": rows[i].todaysCareLikeCnt,
                        "todaysCareReplyCnt": rows[i].todaysCareReplyCnt,
                        "todaysCareHit": rows[i].todaysCareHit
                    }
                }
                conn.release();
                done(data);
            });
        })
    })
}


exports.read = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query('update todays set todaysCareHit = todaysCareHit+1 where todaysCareNum=?', datas[0], function(err, row){
            if(err) logger.error('err', err);
            var sql1 = "select todaysCareNum, memberName, DATE_FORMAT(todaysCareRegdate, '%Y-%m-%d %H:%i:%s') todaysCareRegdate, todaysCareLikeCnt, todaysCareHit," +
                " todaysCareTitle, todaysCareContent, todaysCarePicture1,todaysCarePicture2,todaysCarePicture3," +
                "todaysCarePicture4,todaysCarePicture5, todaysCarePicture6,todaysCarePicture7,todaysCarePicture8," +
                "todaysCarePicture9,todaysCarePicture10 from todaysListView where todaysCareNum=?";
            conn.query(sql1, datas[0], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var sql2 = " select count(*) cnt from todayLikeFlag where todaysCareNum=? and memberId=?";
                conn.query(sql2, datas, function (err, flag) {
                    if (err) logger.error('err', err);
                    var data = {
                        "todaysCareTitle": rows[0].todaysCareTitle,
                        "todaysCareContent": rows[0].todaysCareContent,
                        "memberName": rows[0].memberName,
                        "todaysCareLikeCnt": rows[0].todaysCareLikeCnt,
                        "todaysCareHit": rows[0].todaysCareHit,
                        "todaysCareRegdate": changeTime(rows[0].todaysCareRegdate),
                        "todaysCarePicture1": todaysUrl + rows[0].todaysCarePicture1,
                        "todaysCarePicture2": todaysUrl + rows[0].todaysCarePicture2,
                        "todaysCarePicture3": todaysUrl + rows[0].todaysCarePicture3,
                        "todaysCarePicture4": todaysUrl + rows[0].todaysCarePicture4,
                        "todaysCarePicture5": todaysUrl + rows[0].todaysCarePicture5,
                        "todaysCarePicture6": todaysUrl + rows[0].todaysCarePicture6,
                        "todaysCarePicture7": todaysUrl + rows[0].todaysCarePicture7,
                        "todaysCarePicture8": todaysUrl + rows[0].todaysCarePicture8,
                        "todaysCarePicture9": todaysUrl + rows[0].todaysCarePicture9,
                        "todaysCarePicture10": todaysUrl + rows[0].todaysCarePicture10,
                        "isReaderLike": flag[0].cnt
                    };
                    conn.release();
                    done(data);
                })
            });
        });
    });
};
/*
exports.read = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query('update review set reviewHit = reviewHit+1 where reviewNum=?', datas[0], function(err, row){
            if(err) console.err('err', err);
            // logger.debug('datas[0]', datas[0]);
            var sql = "select todaysCareNum, memberName, DATE_FORMAT(todaysCareRegdate, '%Y-%m-%d %H:%i:%s') todaysCareRegdate, todaysCareLikeCnt, todaysCareHit," +
                " todaysCareTitle, todaysCareContent, todaysCarePicture1,todaysCarePicture2,todaysCarePicture3," +
                "todaysCarePicture4,todaysCarePicture5, todaysCarePicture6,todaysCarePicture7,todaysCarePicture8," +
                "todaysCarePicture9,todaysCarePicture10 from todaysListView where todaysCareNum=?";
            conn.query(sql, datas[0], function (err, row) {
                if (err) logger.error('err', err);
                // logger.debug('row', row);
                var sql2 = "select count(like_flag) isReaderLike  from like_flag where reviewNum = ? and memberId = ? and like_flag=1";
                conn.query(sql2, datas, function (err, like) {
                    if (err) logger.error('err', err);
                    var sql3 = "select count(zzimflag) isReaderZzim from zzim_flag where reviewNum = ? and memberId = ? and zzimflag=1";
                    conn.query(sql3, datas, function (err, zzim) {
                        if (err) logger.error('err', err);
                        var sql4 = "select count(reportFlag) isReaderReport from reportFlag where reviewNum = ? and memberId = ?";
                        conn.query(sql4, datas, function (err, report) {
                            if (err) logger.error('err', err);
                            var data = {
                                "todaysCareTitle": rows[0].todaysCareTitle,
                                "todaysCareContent": rows[0].todaysCareContent,
                                "memberName": rows[0].memberName,
                                "todaysCareLikeCnt": rows[0].todaysCareLikeCnt,
                                "todaysCareHit": rows[0].todaysCareHit,
                                "todaysCareRegdate": changeTime(rows[0].todaysCareRegdate),
                                "todaysCarePicture1": todaysUrl + rows[0].todaysCarePicture1,
                                "todaysCarePicture2": todaysUrl + rows[0].todaysCarePicture2,
                                "todaysCarePicture3": todaysUrl + rows[0].todaysCarePicture3,
                                "todaysCarePicture4": todaysUrl + rows[0].todaysCarePicture4,
                                "todaysCarePicture5": todaysUrl + rows[0].todaysCarePicture5,
                                "todaysCarePicture6": todaysUrl + rows[0].todaysCarePicture6,
                                "todaysCarePicture7": todaysUrl + rows[0].todaysCarePicture7,
                                "todaysCarePicture8": todaysUrl + rows[0].todaysCarePicture8,
                                "todaysCarePicture9": todaysUrl + rows[0].todaysCarePicture9,
                                "todaysCarePicture10": todaysUrl + rows[0].todaysCarePicture10
                                "isReaderLike ": like[0].isReaderLike,
                                "isReaderZzim": zzim[0].isReaderZzim,
                                "isReaderReport": report[0].isReaderReport
                            }
                            conn.release();
                            done(data);
                        });
                    });
                });
            });
        });
    });
}
*/

exports.write = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "INSERT INTO todays (memberId, todaysCareTitle, todaysCareContent,todaysCareThumbnail, " +
            "todaysCarePicture1, todaysCarePicture2, todaysCarePicture3, todaysCarePicture4, todaysCarePicture5," +
            "todaysCarePicture6, todaysCarePicture7, todaysCarePicture8, todaysCarePicture9, todaysCarePicture10, " +
            "todaysCareCategory) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        conn.query(sql, datas, function (err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = false;
            if (row.affectedRows == 1) {
                success = true;
            }
            done(success);
            conn.release();
        })
    })
};

exports.modifyform = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "select todaysCareTitle, todaysCareContent, todaysCarePicture1, todaysCarePicture2, " +
            "todaysCarePicture3, todaysCarePicture4, todaysCarePicture5,todaysCarePicture6, todaysCarePicture7, " +
            "todaysCarePicture8, todaysCarePicture9, todaysCarePicture10, todaysCareCategory from todays where todaysCareNum=?";
        conn.query(sql, datas, function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            conn.release();
            done(rows[0]);
        })
    })
};

exports.modify = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "UPDATE todays SET todaysCareTitle=?, todaysCareContent=?, todaysCarePicture1=?, todaysCarePicture2=?," +
            " todaysCarePicture3=?, todaysCarePicture4=?, todaysCarePicture5=?, todaysCarePicture6=?, todaysCarePicture7=?," +
            " todaysCarePicture8=?, todaysCarePicture9=?, todaysCarePicture10=?,todaysCareCategory=?, todaysCareModifydate=now() where todaysCareNum=?";
        conn.query(sql, datas, function (err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = false;
            if (row.affectedRows == 1) {
                success = true;
            }
            done(success);
            conn.release();
        })
    })
};

exports.delete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "UPDATE todays SET todaysCareIsDeleted=1 where todaysCareNum=?";
        conn.query(sql, datas, function (err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = false;
            if (row.affectedRows == 1) {
                success = true;
            }
            done(success);
            conn.release();
        })
    })
}


exports.replyList = function(datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql1 = "select count(*) cnt from todayReply where todaysCareNum=?";
        conn.query(sql1, datas[2], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            var cnt = rows[0].cnt;
            var size = datas[1] * 1;
            var begin = (datas[0] - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((datas[0] - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((datas[0] - 1) * size);
            var sql2 = "select tr.todayReplyNum, mem.memberName, mem.memberPicture, DATE_FORMAT(tr.todayReplyRegdate, '%Y-%m-%d %H:%i:%s') todayReplyRegdate, " +
                "tr.todayReplyRegdate, tr.todayReplyContent from todayReply tr, member mem where tr.todaysCareNum=? and tr.todayReplyIsDeleted=0 " +
                "and tr.memberId = mem.memberId order by todayReplyRegdate asc limit ?,?";
            conn.query(sql2, [datas[2], begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    data[i] = {
                        "todayReplyNum": rows[i].todayReplyNum,
                        "memberPicture": memberUrl + rows[i].memberPicture,
                        "memberName": rows[i].memberName,
                        "todayReplyRegdate": changeTime(rows[i].todayReplyRegdate),
                        "todayReplyContent": rows[i].todayReplyContent
                    }
                }
                conn.release();
                done(data);
            });
        })
    })
}


exports.reply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "INSERT INTO todayReply (todaysCareNum, memberId, todayReplyContent) VALUES (?, ?, ?)";
        conn.query(sql, datas, function (err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = false;
            if (row.affectedRows == 1) {
                success = true;
            }
            done(success);
            conn.release();
        })
    })
}

exports.delReply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "UPDATE todayReply SET todayReplyIsDeleted=1 WHERE todayReplyNum=? and memberId=?";
        conn.query(sql, datas, function (err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = false;
            if (row.affectedRows == 1) {
                success = true;
            }
            done(success);
            conn.release();
        });
    });
}


exports.like = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "INSERT INTO todayLikeFlag (memberId, todaysCareNum, todayLikeFlag) VALUES (?, ?, ?)  ON DUPLICATE KEY UPDATE todayLikeFlag = ?";
        conn.query(sql, datas, function (err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            var success = false;
            if (row.affectedRows >= 1) {
                success = true;
            }
            done(success);
            conn.release();
        })
    })
}

//
//exports.likeCancel = function (datas, done) {
//    pool.getConnection(function (err, conn) {
//        if (err) logger.error('err', err);
//        var sql = "DELETE FROM todayLikeFlag WHERE  memberId=? AND todaysCareNum=?";
//        conn.query(sql, datas, function (err, row) {
//            if (err) logger.debug('err', err);
//            logger.debug('row', row);
//            var success = false;
//            if (row.affectedRows == 1) {
//                success = true;
//            }
//            done(success);
//            conn.release();
//        })
//    })
//}

function changeTime(inputDate){
    var regdate = new Date(inputDate);
    var now = new Date();
    var time = parseInt((now - regdate) / (1000*60));

    if(time < 60){
        return time + "분 전";
    }
    else if ( ((time/60)/24) > 1) {
     return inputDate;
    }
    else if (time >= 60){
     return parseInt(time/60) + "시간 전";
    }
}