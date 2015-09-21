//db_baby.js
var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');
var sql = require('./sql');
var pool = mysql.createPool(db_config);
var babyUrl = "http://52.68.92.194/images/uploads/baby/";


//아이 보기
exports.read = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error(err);
            done(err);
        } else {
            conn.query(sql.readBaby, datas, function (err, rows) {
                if (err) {
                    logger.error(err);
                    done(err);
                } else {
                    logger.debug('rows',rows);
                    var data = [];
                    var message = "아이 보기 성공!!";
                    for (var i = 0; i < rows.length; i++) {
                        data[i] = {
                            "babyNum": rows[i].babyNum,
                            "memberId": rows[i].memberId,
                            "babyName": rows[i].babyName,
                            "babyPicture": babyUrl + rows[i].babyPicture,
                            "babyBirth": rows[i].babyBirth,
                            "babyAfterBirth": changeTime(rows[i].babyBirth),
                            "babyGender": rows[i].babyGender,
                            "babyIsChecked": rows[i].babyIsChecked
                        }
                    }
                    done(err, data);
                    conn.release();
                }
            });
        }
    });
};

//아이 추가
// datas = [memberId, babyName, babyBirth, babyGender, babyPicture, babyIsChecked];
exports.add = function (datas, done) {
    var success = 0,
        memberId = datas[0],
        babyGender = babyGender,
        babyIsChecked = datas[5];
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
            return;
        }
        conn.query(sql.cntBaby, memberId, function (err, row) {
            // logger.debug('row', row);
            if (err) {
                logger.error('err', err);
                done(err);
                return
            }
            if (row[0].cnt == 0) { //아이를 처음 등록하는 경우
                // logger.debug('row[0].cnt', row[0].cnt);
                conn.query(sql.insertBaby, datas, function (err, row) {
                    if (err) {
                        logger.error('err', err);
                        done(err);
                        return
                    }
                    // logger.debug('row', row);
                     success = 0;    //실패한 경우
                    if (( (babyGender == 1) || (babyGender == 2) ) && (row.affectedRows == 1)) { //일반적인 경우. (babyGender 1 or 2)
                        success = 1; // req.session.babyBirth = datas[2]; , 대표아이 설정시 success 1로 넘김
                    }
                    else if ((babyGender == 3) && (row.affectedRows == 1)) {  // 출산 예정 아이의 경우 (babyGender 3)
                        success = 2; //req.session.babyBirth = new Date();, 출산 예정 아이시 success 2로 넘김
                    }
                    done(null, success);
                    conn.release();
                });
            } else if (row[0].cnt > 0) {
                if (babyIsChecked == 0) {  //아이가 대표아이 설정이 안된 경우
                    conn.query(sql.insertBaby, datas, function (err, row) {
                        if (err) {
                            logger.error('err', err);
                            done(err);
                            return
                        }
                        // logger.debug('row', row);
                            success = 0;
                        if (row.affectedRows == 1) {
                            success = 3;    //대표아이 설정이 안된 경우 3으로 넘김
                        }
                        done(null, success);
                        conn.release();
                    });
                } else if (babyIsChecked == 1) {    //아이가 대표아이로 설정이 된 경우
                    conn.query(sql.updateBaby, memberId, function (err, row) {
                        if (err) {
                            logger.error('err', err);
                            done(err);
                            return
                        }
                        // logger.debug('row', row);
                        conn.query(sql.insertBaby, datas, function (err, row) {
                            if (err) logger.error('err', err);
                            // logger.debug('row', row);
                            success = 0;
                            if (row.affectedRows == 1) {
                                success = 1;    // req.session.babyBirth = datas[2]; , 대표아이 설정시 success 1로 넘김
                            }
                            done(null, success);
                            conn.release();
                        });
                    });
                } else {
                    success = 0;
                    done(null, success);
                    conn.release();
                }
            }
        })
    })
};


//아이 추가
exports.add2 = function (datas, done) {
    // datas = [memberId, babyName, babyBirth, babyGender, babyIsChecked];
    var success = 0,
        memberId = datas[0],
        babyGender = datas[3],
        babyIsChecked = datas[4];
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.cntBaby, memberId, function (err, row) {
            if (err) logger.error('err', err);
            if (row[0].cnt == 0) { //아이를 처음 등록하는 경우
                conn.query(sql.insertBaby, datas, function (err, row) {
                    if (err) logger.error('err', err);
                    success = 0;    //실패한 경우
                    if (( (babyGender == 1) || (babyGender == 2) ) && (row.affectedRows == 1)) { //일반적인 경우. (babyGender 1 or 2)
                        success = 1; // req.session.babyBirth = datas[2]; , 대표아이 설정시 success 1로 넘김
                    }
                    else if ((babyGender == 3) && (row.affectedRows == 1)) {  // 출산 예정 아이의 경우 (babyGender 3)
                        success = 2; //req.session.babyBirth = new Date();, 출산 예정 아이시 success 2로 넘김
                    }
                    done(success);
                    conn.release();
                });
            } else if (row[0].cnt > 1) {
                if (babyIsChecked == 0) {  //아이가 대표아이 설정이 안된 경우
                    conn.query(sql.insertBaby, datas, function (err, row) {
                        if (err) logger.error('err', err);
                        success = 0;
                        if (row.affectedRows == 1) {
                            success = 3;    //대표아이 설정이 안된 경우 3으로 넘김
                        }
                        done(success);
                        conn.release();
                    });
                } else if (babyIsChecked == 1) {    //아이가 대표아이로 설정이 된 경우
                    conn.query(sql.updateBaby, memberId, function (err, row) {
                        if (err) logger.error('err', err);
                        conn.query(sql.insertBaby, datas, function (err, row) {
                            if (err) logger.error('err', err);
                            success = 0;
                            if (row.affectedRows == 1) {
                                success = 1;    // req.session.babyBirth = datas[2]; , 대표아이 설정시 success 1로 넘김
                            }
                            done(success);
                            conn.release();
                        });
                    });
                } else {
                    success = 0;
                    done(success);
                    conn.release();
                }
            }
        });
    });
};

//아이 수정
exports.modify = function (datas, done) {
    var success = 0, len = datas.length, memberId = datas[len -1], babyIsChecked = datas[0];
    sql.modifyBaby(len, memberId, babyIsChecked, function(sql1, sql2){
        pool.getConnection(function (err, conn) {
            if(err){
                logger.error('err',err);
                done(err)
                return;
            }
            conn.query(sql1, datas, function (err, row) {
                if(err){
                    logger.error('err',err);
                    done(err)
                    return;
                }
                logger.debug('row', row);
                success = 0;
                if ((babyIsChecked == 1) && (row.affectedRows >= 1)) {
                    conn.query(sql2, datas, function (err, row) {
                        if(err){
                            logger.error('err',err);
                            done(err)
                            return;
                        }
                        logger.debug('row', row);
                        if (row.affectedRows >= 1) {
                            success = 2;
                        }
                    });
                }else if (row.affectedRows >= 1) {
                    success = 1;
                }
                done(null, success);
                conn.release();
            });
        });
    })
}

//아이 삭제
exports.delete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) clogger.error('err', err);
        conn.query(sql.delBaby, datas, function (err, row) {
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

function changeTime(inputDate) {
    var regdate = new Date(inputDate);
    var now = new Date();
    var time = parseInt((now - regdate) / (1000 * 60 * 60 * 24));

    if (time <= 100) {
        return "생후 " + time + "일";
    }
    else if (time > 100) {
        return "생후 " + parseInt(time / 30) + "개월";
    }
}
