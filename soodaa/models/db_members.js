//db_members.js
var mysql = require('mysql');
var async = require('async');
var db_config = require('./db_config');
var logger = require('../etc/logger');
var sql = require('./sql');

var pool = mysql.createPool(db_config);
var memberUrl = "http://52.68.92.194/images/uploads/member/";
var reviewUrl = "http://52.68.92.194/images/uploads/review/";


//회원가입
exports.join = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.isIdExists, datas[0], function (err, row) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            if (row[0].cnt == 0) {
                conn.query(sql.memberJoin, datas, function (err, row) {
                    if(err) {
                        logger.error('err', err);
                        var message = "SQL2 에러";
                        done(err, message);
                        return;
                    }
                    var success = 0;
                    var message = "가입 실패"
                    if (row.affectedRows == 1) {
                        success = 1;
                        message = "가입 성공"
                    }
                    done(null, message, success);
                    conn.release();
                });
            } else {
                var success = 2;
                var message = "이미 가입한 회원"
                done(null, message, success);
                conn.release();
            }
        });
    });
}

//로그인
exports.login = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.confirmId, datas,
            function (err, rows) {
                if(err) {
                    logger.error('err', err);
                    var message = "SQL1 에러";
                    done(err, message);
                    return;
                }
                var success = false;
                var message = "로그인 실패";
                if (rows[0].cnt == 1) {
                    conn.query(sql.baby, datas[0], function (err, baby) {
                        if(err) {
                            logger.error('err', err);
                            var message = "SQL2 에러";
                            done(err, message);
                            return;
                        }
                        if (baby.length > 0) {
                            var babyBirth = baby[0].babyBirth;
                            var isBabyChecked = 1;
                        } else {
                            var babyBirth = 'no'
                            var isBabyChecked = 0;
                        }
                        conn.query(sql.updateGCM, [datas[2], datas[0]], function (err, row) {
                            if(err) {
                                logger.error('err', err);
                                var message = "SQL3 에러";
                                done(err, message);
                                return;
                            }
                            if (row.affectedRows == 1) {
                                message = "로그인 성공";
                                success = true;
                            }
                            done(null, message, success, babyBirth, isBabyChecked);
                            conn.release();
                        })

                    })
                } else {
                    done(null, message, success);
                    conn.release();
                }
            });
    });
};

//페이스북로그인
exports.fb_login = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.fbLogin, datas[1], function (err, rows) {
            if(err) {
                logger.error('err', err);
                var message = "SQL2 에러";
                done(err, message);
                return;
            }
            var success = false;
            var message = "페이스북 로그인 실패"
            if (rows[0].cnt == 0) {
                conn.query(sql.fbInsert2, datas, function (err, row) {
                    if(err) {
                        logger.error('err', err);
                        var message = "SQL2 에러";
                        done(err, message);
                        return;
                    }
                    if (row.affectedRows == 1) {
                        success = true;
                        var babyBirth = 'no'
                        var isBabyChecked = 0;
                        var message = "페이스북 로그인 성공"

                    }
                    done(null, message, success, babyBirth, isBabyChecked);
                    conn.release();
                })
            } else {
                conn.query(sql.baby, datas[1], function (err, baby) {
                    if(err) {
                        logger.error('err', err);
                        var message = "SQL 에러";
                        done(err, message);
                        return;
                    }
                    if (baby.length > 0) {
                        var babyBirth = baby[0].babyBirth;
                        var isBabyChecked = 1;
                    } else {
                        var babyBirth = 'no'
                        var isBabyChecked = 0;

                    }
                    conn.query(sql.updateGCM, [datas[4], datas[1]], function (err, row) {
                        if (err) logger.error('err', err);
                        if (row.affectedRows == 1) {
                            success = true;
                            message = "페이스북 로그인 성공"
                        }
                        conn.release()
                        done(null, message, success, babyBirth, isBabyChecked)
                    })
                })
            }
        })
    })
}


//비밀번호 찾기
exports.find = function (data, done) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.isIdExists, data[1], function (err, rows) {
            if(err) {
                logger.error('err', err);
                var message = "SQL1 에러";
                done(err, message);
                return;
            }
            if (rows[0].cnt == 1) {
                conn.query(sql.findPW, data, function (err, row) {
                    if(err) {
                        logger.error('err', err);
                        var message = "SQL2 에러";
                        done(err, message);
                        return;
                    }
                    var success = false;
                    var message = "비밀번호 찾기 실패"
                    if (row.affectedRows == 1) {
                        success = true;
                        message = "비밀번호 찾기 성공"
                    }
                    done(null, message, success);
                    conn.release();
                })
            }
        });
    })
};

//비밀번호 변경 페이지
exports.passchangeform = function (data, done) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.changePWForm, data, function (err, row) {
            if(err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            logger.debug('row', row);
            var success = false;
            var message = "비밀번호 찾기 실패"
            if (row[0].cnt == 1) {
                success = true;
                message = "비밀번호 찾기 성공"
            }
            done(null, message, success);
            conn.release();
        })
    })
}


//비밀번호 변경
exports.passchange = function (data, done) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.changePW, data, function (err, row) {
            if(err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            var success = false;
            var message = "비밀번호 변경 실패"
            if (row.affectedRows == 1) {
                success = true;
                message = "비밀번호 변경 성공"
            }
            done(null, message, success);
            conn.release();
        })
    })
}

//프로필 보기
exports.read = function (data, done) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.readProfile, data, function (err, rows) {
            if(err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            var row = rows[0];
            logger.debug('row', row);
            var data = {
                "memberPicture": memberUrl + row.memberPicture,
                "memberName": row.memberName,
                "memberBirth": row.memberBirth,
                "memberAddress": row.memberAddress
            }
            var message = "프로필 보기 성공"
            done(null, message, data);
            conn.release();
        })
    })
};


//프로필 수정
exports.modify = function (datas, done) {
    var len = datas.length;
    sql.modifyMember(len, function(sql){
        pool.getConnection(function (err, conn) {
            if(err) {
                logger.error('err', err);
                var message = "DB 연결 중 에러"
                done(err, message);
                return;
            }
            conn.query(sql, datas, function (err, row) {
                if(err) {
                    logger.error('err', err);
                    var message = "SQL 에러";
                    done(err, message);
                    return;
                }
                var success = false;
                var message = "프로필 수정 실패"
                if (row.affectedRows == 1) {
                    success = true;
                    message = "프로필 수정 성공"
                }
                done(null, message, success);
                conn.release();
            });
        })
    })
};

// 마이페이지(구버젼)
//exports.mypage = function (datas, done) {
//    var data ={};
//    var message = "";
//    pool.getConnection(function (err, conn) {
//        if(err) {
//            logger.error('err', err);
//            message = "DB 연결 중 에러";
//            done(err, message);
//            return;
//        }
//        conn.query(sql.myPage, datas, function (err, rows) {
//            if(err) {
//                logger.error('err', err);
//                message = "SQL 에러";
//                done(err, message);
//                return;
//            }
//            var tmp = [rows[0]];
//            conn.query(sql.myPage2, datas, function (err, rows) {
//                if(err) {
//                    logger.error('err', err);
//                    message = "SQL2 에러";
//                    done(err, message);
//                    return;
//                }
//                tmp.push(rows[0]);
//                sql.memberExpFunc(tmp[1].memberExp, function (expPercent, memberLevel){
//                    data = {
//                        "memberName": tmp[0].memberName,
//                        "memberPicture": memberUrl + tmp[0].memberPicture,
//                        "memberLevel": memberLevel,
//                        "memberExp": expPercent,
//                        "memberLikeCnt": tmp[1].totalLikes,
//                        "memberHitCnt": tmp[1].totalHits,
//                        "memberZzimCnt": tmp[1].totalZzims,
//                        "memberReviewCnt": tmp[1].totalReviews
//                    }
//                });
//                message = "마이 페이지 성공";
//                done(null, message, data);
//                conn.release();
//            })
//        })
//    })
//};

exports.mypage = function(datas, done) {
    pool.getConnection(function(err, conn){
        if(err){
            logger.error('err', err);
            done(err);
            return;
        }
        var sql1 = "select totalHits, totalReviews, totalLikes, totalZzims, totalReports, memberName, memberPicture, rankTotal " +
            "from (select sum(r.reviewHit) totalHits, count(r.reviewNum) totalReviews, " +
            "sum((select count(1) from like_flag lf where lf.reviewNum = r.reviewNum and lf.like_flag = 1)) totalLikes, " +
            "sum((select count(1) from zzim_flag zf where zf.reviewNum = r.reviewNum and zf.zzimflag = 1)) totalZzims, " +
            "sum((select count(1) from reportFlag rf where rf.reviewNum = r.reviewNum and rf.reportFlag = 1)) totalReports, " +
            "m.memberName, m.memberPicture, m.rankTotal " +
            "from review r , member m " +
            "where r.memberId=m.memberId and m.memberId = ?) a";
        conn.query(sql1, datas, function(err, rows){
            if(err){
                logger.error('err', err);
                done(err);
                return;
            }
            var sql2 = "select levelNum, startExp, endExp from level where ? between startExp and endExp";
            conn.query(sql2, rows[0].rankTotal, function(err, level){
                if(err){
                    logger.error('err', err);
                    done(err);
                    return;
                }
                var totalExp = level[0].endExp - level[0].startExp;
                var myExp = rows[0].rankTotal - level[0].startExp;
                var percentExp = Math.round(myExp/totalExp * 100);
                var data = {
                    "memberName": rows[0].memberName,
                    "memberPicture": memberUrl + rows[0].memberPicture,
                    "memberLikeCnt": rows[0].totalLikes,
                    "memberHitCnt": rows[0].totalHits,
                    "memberZzimCnt": rows[0].totalZzims,
                    "memberReviewCnt": rows[0].totalReviews,
                    "memberLevel": level[0].levelNum,
                    "memberExp": percentExp
                }
                logger.debug('data',data);
                done(null, data);
                conn.release();

            })

        })



    })
}

// 찜 목록
exports.zzim = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러";
            done(err, message);
            return;
        }
        conn.query(sql.cntZzim, datas[0], function (err, rows) {
            if(err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            var cnt = rows[0].cnt;
            var size = datas[2] * 1;
            var begin = (datas[1] - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((datas[1] - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((datas[1] - 1) * size);
            conn.query(sql.listZzim, [datas[0], begin, size], function (err, rows) {
                if(err) {
                    logger.error('err', err);
                    var message = "SQL 에러";
                    done(err, message);
                    return;
                }
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    data[i] = {
                        "reviewNum": rows[i].reviewNum,
                        "productName": rows[i].productName + ' ' + rows[i].productBrand,
                        "reviewPicture": reviewUrl + rows[i].reviewPicture,
                        "likeFlagCnt": rows[i].likeFlagCnt,
                        "reviewReplyCnt": rows[i].reviewReplyCnt,
                        "reviewHit": rows[i].reviewHit
                    }
                }
                var message = "찜 목록 성공"
                logger.debug('data', data);
                conn.release();
                done(null, message, data);
            });
        })
    })
};


// 내가 쓴 게시글
exports.mylist = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러";
            done(err, message);
            return;
        }
        conn.query(sql.cntReview, datas[0], function (err, rows) {
            if(err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            var cnt = rows[0].cnt;
            var size = datas[2] * 1;
            var begin = (datas[1] - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((datas[1] - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((datas[1] - 1) * size);
            conn.query(sql.myList, [datas[0], begin, size], function (err, rows) {
                if(err) {
                    logger.error('err', err);
                    var message = "SQL 에러";
                    done(err, message);
                    return;
                }
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    data[i] = {
                        "reviewNum": rows[i].reviewNum,
                        "productName": rows[i].productName + ' ' + rows[i].productBrand,
                        "reviewPicture": reviewUrl + rows[i].reviewPicture,
                        "likeFlagCnt": rows[i].likeFlagCnt,
                        "reviewReplyCnt": rows[i].reviewReplyCnt,
                        "reviewHit": rows[i].reviewHit
                    }
                }
                var message = "내가 쓴 게시글 성공"
                conn.release();
                done(null, message, data);
            });
        })
    })
};


//사이드 메뉴(구버젼)
//exports.sidemenu = function (datas, done) {
//    var data = {};
//    pool.getConnection(function (err, conn) {
//        if(err) {
//            logger.error('err', err);
//            var message = "DB 연결 중 에러";
//            done(err, message);
//            return;
//        }
//        conn.query(sql.sideMenu, datas, function (err, rows) {
//            if(err) {
//                logger.error('err', err);
//                var message = "SQL 에러";
//                done(err, message);
//                return;
//            }
//            var row = rows[0];
//            sql.memberExpFunc(rows[0].memberExp, function(expPercent, memberLevel){
//                data = {
//                    "memberPicture": memberUrl + row.memberPicture,
//                    "memberName": row.memberName,
//                    "memberLevel": memberLevel,
//                    "memberExp": expPercent
//                }
//            });
//            var message = "사이드 메뉴 얻기"
//            done(null, message, data);
//            conn.release();
//        });
//    });
//}

//사이드메뉴
exports.sidemenu = function(datas, done) {
    pool.getConnection(function(err, conn){
        if(err) {
            logger.error('err', err);
            done(err);
            return;
        }
        var sql1 = "select memberName, memberPicture, rankTotal from member where memberId = ?";
        conn.query(sql1, datas, function(err, rows){
            if(err) {
                logger.error('err', err);
                done(err);
                return;
            }
            var sql2 = "select levelNum, startExp, endExp from level where ? between startExp and endExp";
            conn.query(sql2, rows[0].rankTotal, function(err, level){
                if(err) {
                    logger.error('err', err);
                    done(err);
                    return;
                }
                var totalExp = level[0].endExp - level[0].startExp;
                var myExp = rows[0].rankTotal - level[0].startExp;
                var percentExp = Math.round(myExp/totalExp * 100);
                var data = {
                    "memberName": rows[0].memberName,
                    "memberPicture": memberUrl + rows[0].memberPicture,
                    "memberLevel": level[0].levelNum,
                    "memberExp": percentExp
                };
                done(null, data);
                conn.release();

            })

        })
    })
}

//regId 얻기
exports.regId = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.getRegId, datas, function (err, rows) {
            if (err) logger.error('err', err);
            done(rows[0]);
            conn.release();
        });
    });
}


exports.getKeyword = function(done) {
    var result=[];
    pool.getConnection(function (err, conn) {
        if(err) {
            logger.error('err',err);
            done(err);
            return;
        }
        conn.query(sql.getKeyword1, [], function(err,row){
            if(err) {
                logger.error('err',err);
                done(err);
                return;
            }
            logger.debug('cate1', row);
            async.eachSeries(row, function(data, callback){
                if(data.productCategory1!=null){
                    conn.query(sql.getKeyword2, data.productCategory1, function(err, rows){
                        if(err){
                            logger.error('err', err);
                            callback(err);
                        } else {
                            var keyword = [];
                            for(var i=0; i<rows.length;i++){
                                if(rows[i].productCategory2!=null){
                                    keyword.push(rows[i].productCategory2);
                                } else {

                                }
                            }
                            var cate2 = {
                                "title": data.productCategory1,
                                "keyword": keyword
                            }
                            logger.debug('data', cate2);
                            result.push(cate2);
                            callback(null);
                        }
                    })
                } else {
                        callback(null);
                }

            }, function(err){
                if(err){
                    done(err);
                } else {
                    //logger.debug('result',result);
                    done(null, result);
                }
            })

        })
    })
}