// db_admin.js
var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');
var sql = require('./sql');

var todaysUrl = "http://52.68.92.194/images/uploads/todays/";
var choiceUrl = "http://52.68.92.194/images/uploads/choice/";
var reviewUrl = "http://52.68.92.194/images/uploads/review/";

var pool = mysql.createPool(db_config);

//로그인
/*****************************************
 * 관리자 로그인
 * @param datas
 * datas = [memberId, memberPasswd]
 * @param done(success)
 ****************************************/
exports.login = function (datas, done) {
    pool.getConnection(function (err, conn) {
        conn.query(sql.adminLogin, datas, function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            var success = false;
            if (rows[0].cnt == 1) {
                success = true;
            }
            done(success);
            conn.release();
        });
    });
};

/*****************************************
 * 오늘의 육아 리스트
 * @param page
 * @param callback
 */
exports.todaysList = function (page, callback) {
    sql.listFunction(pool, page, sql.todaysListCnt, sql.todaysList, function(datas){
        logger.debug('datas', datas);
        callback(datas);
    });
}


/*****************************************
 *  오늘의 육아 쓰기
 * @param datas
 * datas = [memberId, todaysCareTitle, todaysCareContent, todaysCareThumbnail, todaysCarePicture1, todaysCarePicture2,
    todaysCarePicture3, todaysCarePicture4, todaysCarePicture5, todaysCarePicture6,
    todaysCarePicture7, todaysCarePicture8, todaysCarePicture9, todaysCarePicture10, todaysCareCategory]
 * @param done
 */
exports.todaysWrite = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
        } else {
            conn.query(sql.todaysWrite, datas, function (err, row) {
                if (err) {
                    logger.error('err', err);
                    done(err);
                } else {
                    var success = false;
                    if (row.affectedRows == 1) {
                        success = true;
                    }
                    done(null, success);
                    conn.release();
                }
            })
        }
    })
};

/*****************************************
 * 오늘의 육아 읽기
 * @param datas
 * datas = [todaysCareNum * 1, memberId]
 * @param done
 */
exports.todaysRead = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.todaysRead, datas[0], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            if (rows[0].todaysCareIsDeleted == 0) {
                var todaysDel = '게시됨'
            } else {
                var todaysDel = '삭제됨'
            }

            if (rows[0].todaysCareCategory == 1) {
                var todaysCate = '육아'
            } else if (rows[0].todaysCareCategory == 2) {
                var todaysCate = '제품/서비스'
            } else if (rows[0].todaysCareCategory == 3) {
                var todaysCate = '임신'
            }
            conn.query(sql.todaysReply, datas[0], function(err, row){
                if (err) logger.error('err', err);
                logger.debug('row', row);
                var data = {
                    "todaysCareNum": rows[0].todaysCareNum,
                    "todaysCareTitle": rows[0].todaysCareTitle,
                    "todaysCareContent": rows[0].todaysCareContent,
                    "memberName": rows[0].memberName,
                    "todaysCareRegdate": rows[0].todaysCareRegdate,
                    "todaysCareCategory": todaysCate,
                    "todaysCareDeleted": todaysDel,
                    "todaysCareHit": rows[0].todaysCareHit,
                    "todaysCareLikeCnt": rows[0].todaysCareLikeCnt,
                    "todaysCareReplyCnt": rows[0].todaysCareReplyCnt,
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
                    "comment": row
                };
                conn.release();
                done(data);
            })
        })
    });
};



exports.testparallel = function (indexNum, callback) {
    sql.readWithComment(pool, indexNum, sql.todaysRead, sql.todaysReply, function(err, datas){
        if(err) logger.error('erriiii', err);
        logger.debug('datasiii', datas);
        callback(datas);
    });
}

//오늘의 육아 수정 폼
/*****************************************
 * 오늘의 육아 수정 폼
 * @param datas(todaysCareNum)
 * @param done
 */
exports.todaysModifyform = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.selectTodaysModify, datas, function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            var data = {
                "todaysCareNum": rows[0].todaysCareNum,
                "todaysCareTitle": rows[0].todaysCareTitle,
                "todaysCareContent": rows[0].todaysCareContent,
                "memberName": rows[0].memberName,
                "todaysCareRegdate": rows[0].todaysCareRegdate,
                "todaysCareCategory": rows[0].todaysCareCategory,
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
            };
            conn.release();
            done(data);
        })
    });
}

//오늘의 육아 수정
exports.todaysModify = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.todaysModify, datas, function (err, row) {
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

//오늘의 육아 삭제
exports.todaysDelete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.todaysDelete, datas, function (err, row) {
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

////////////////////////////////////////////////////////////공지사항

//공지사항 리스트
exports.noticeList = function (page, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.noticeListCnt, [], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
            var cnt = rows[0].cnt;
            var size = 10; //보여줄 글의 수
            var begin = (page - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((page - 1) * size);

            conn.query(sql.noticeList, [begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var datas = {
                    title: "게시판 리스트",
                    data: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                conn.release();
                done(datas);
            });
        });
    });
}

//공지사항 쓰기
exports.noticeWrite = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);

        conn.query(sql.noticeWrite, datas, function (err, row) {
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

//공지사항 읽기
exports.noticeRead = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.noticeRead, datas, function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            conn.release();
            done(rows[0]);

        })
    })
}

//공지사항 수정 폼
exports.noticeModifyform = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);

        conn.query(sql.noticeModifyform, datas, function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            conn.release();
            done(rows[0]);
        })
    })
}

//공지사항 수정
exports.noticeModify = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);

        conn.query(sql.noticeModify, datas, function (err, row) {
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

//공지사항 삭제
exports.noticeDelete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.noticeDelete, datas, function (err, row) {
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

//////////////////////////////////////////////////////제품관리
//제품 리스트
exports.productList = function (page, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.productListCnt, [], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
            var cnt = rows[0].cnt;
            var size = 10; //보여줄 글의 수
            var begin = (page - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((page - 1) * size);

            conn.query(sql.productList, [begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var datas = {
                    title: "제품 리스트",
                    data: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                conn.release();
                done(datas);
            });
        });
    })
}
//제품 등록
exports.productWrite = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
            return;
        }
        conn.query(sql.productWrite_admin, datas, function (err, row) {
            if (err) {
                logger.error('err', err);
                done(err);
                return;
            }
            var success = false;
            if (row.affectedRows == 1) {
                success = true;
            }
            conn.release();
            done(null, success);

        })
    })
}

//제품 수정 폼
exports.productModifyform = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.productModifyform, datas, function (err, row) {
            if (err) logger.error('err', err);
            conn.release();
            done(row[0]);
        })
    })
}

//제품 수정
exports.productModify = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.productModify, datas, function (err, row) {
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

//제품 삭제
exports.productDelete = function(datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.productDelete, datas, function (err, row) {
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

//제품 검색
exports.productSearch = function(datas, done) {
    pool.getConnection(function (err,conn) {
        if(err) logger.error('err',err);
        var keyword = datas[2];
        var switchNum = datas[1];
        sql.admin_productSearch(switchNum, keyword, function(sql1, sql2){
            conn.query(sql1, function(err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
                var cnt = rows[0].cnt;
                var size = 10; //보여줄 글의 수
                var begin = (datas[0] - 1) * size; //시작 글 번호
                var totalPage = Math.ceil(cnt / size);
                var pageSize = 10; // 링크 갯수
                var startPage = Math.floor((datas[0] - 1) / pageSize) * pageSize + 1; //시작 링크
                var endPage = startPage + (pageSize - 1); //끝 링크
                if (endPage > totalPage) {
                    endPage = totalPage;
                }
                var max = cnt - ((datas[0] - 1) * size);
                conn.query(sql2, [begin, size], function (err, rows) {
                    if (err) logger.error('err', err);
                    //logger.debug('rows', rows);
                    var data = {
                        title: "제품 리스트",
                        data: rows,
                        page: datas[0],
                        pageSize: pageSize,
                        startPage: startPage,
                        endPage: endPage,
                        totalPage: totalPage,
                        max: max,
                        search: datas[1],
                        query: datas[2]
                    };
                    conn.release();
                    done(data);
                });
            });
        });
    });
}




exports.reportList = function (page, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.reportListCnt, [], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
            var cnt = rows[0].cnt;
            var size = 10; //보여줄 글의 수
            var begin = (page - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((page - 1) * size);
            conn.query(sql.reportList, [begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var datas = {
                    title: "신고 리스트",
                    data: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                conn.release();
                done(datas);
            });
        });
    })
}

exports.reportComplete = function(datas, done){
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.reportComplete, datas, function (err, row) {
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

exports.memberList = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        if(datas[2]==1){
            var sql1 = sql.memberListCnt1;
            var sql2 = sql.memberList1
        } else {
            var sql1 = sql.memberListCnt2;
            var sql2 = sql.memberList2
        }
        conn.query(sql1, datas[1], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
            var page = datas[0];
            var cnt = rows[0].cnt;
            var size = 10; //보여줄 글의 수
            var begin = (page - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((page - 1) * size);
            conn.query(sql2, [datas[1], begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var data = {
                    title: "회원 리스트",
                    data: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                conn.release();
                done(data);
            });
        });
    })
}

exports.regblack = function(datas, done){
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.regblack, datas, function (err, row) {
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

exports.releaseblack = function(datas, done){
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.releaseblack, datas, function (err, row) {
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

exports.memberRead = function (id, done) {
    pool.getConnection(function (err, conn) {
        conn.query(sql.memberRead1, id, function (err, rows) {
            if (err) {
                logger.error('err', err);
            } else {
                var tmp = [rows[0]];
                logger.debug('tmp1', tmp);
                conn.query(sql.memberRead2, id, function (err, rows) {
                    if (err) logger.error('err', err);
                    tmp.push(rows[0]);
                    logger.debug('tmp2', tmp);
                    var datas = {
                        "memberId" : tmp[0].memberId,
                        "memberName": tmp[0].memberName,
                        "memberPicture": tmp[0].memberPicture,
                        "memberLevel": tmp[0].memberLevel,
                        "memberExp": tmp[0].memberExp,
                        "memberWithdraw" : tmp[0].memberWithdraw,
                        "totalReplies" : tmp[1].totalReplies,
                        "memberLikeCnt": tmp[1].totalLikes,
                        "memberHitCnt": tmp[1].totalHits,
                        "memberZzimCnt": tmp[1].totalZzims,
                        "memberReviewCnt": tmp[1].totalReviews
                    }
                    done(datas);
                    conn.release();
                });
            }
        });
    });
};

exports.reviewList = function(page, done){
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.reviewCnt, [], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
            /*var page = datas[0];*/
            var cnt = rows[0].cnt;
            var size = 10; //보여줄 글의 수
            var begin = (page - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((page - 1) * size);
            conn.query(sql.admin_reviewPaging, [begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var datas = {
                    title: "멤버 리스트",
                    data: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                conn.release();
                done(datas);
            });
        });
    })
}

// 읽기
exports.reviewRead = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.admin_reviewRead, datas[0], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            conn.query(sql.admin_reviewReplyList, datas[0], function(err, comment){
                if(err) logger.error('err',err);
                logger.debug('comment', comment);
                if (rows[0].reviewIsDeleted == 0) {
                    var reviewDel = '-'
                } else {
                    var reviewDel = '삭제됨'
                }
                var data = {
                    "reviewNum": rows[0].reviewNum,
                    "memberId" : rows[0].memberId,
                    "memberName" : rows[0].memberName,
                    "productName" : rows[0].productName,
                    "reviewRegdate": rows[0].reviewRegdate,
                    "reviewStar" : rows[0].reviewStar,
                    "reviewHit": rows[0].reviewHit,
                    "likeFlagCnt": rows[0].likeFlagCnt,
                    "zzimCnt" : rows[0].zzimCnt,
                    "reviewReplyCnt": rows[0].reviewReplyCnt,
                    "reportFlagCnt" : rows[0].reportFlagCnt,
                    "reviewContent": rows[0].reviewContent,
                    "reviewWhere" : rows[0].reviewWhere,
                    "reviewPrice" : rows[0].reviewPrice,
                    "reviewKnowhow" : rows[0].reviewKnowhow,
                    "reviewGood" : rows[0].reviewGood,
                    "reviewBad" : rows[0].reviewBad,
                    "reviewRecommandPeople" : rows[0].reviewRecommandPeople,
                    "reviewPicture1": reviewUrl + rows[0].reviewPicture1,
                    "reviewPicture2": reviewUrl + rows[0].reviewPicture2,
                    "reviewPicture3": reviewUrl + rows[0].reviewPicture3,
                    "reviewPicture4": reviewUrl + rows[0].reviewPicture4,
                    "reviewPicture5": reviewUrl + rows[0].reviewPicture5,
                    "reviewIsDeleted": reviewDel,
                    "comment": comment
                };
                conn.release();
                done(data);
            })

        })
    });
};

exports.reviewDelete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.reviewDelete, datas, function (err, row) {
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

exports.reviewModifyProduct = function (data, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);

        conn.query(sql.reviewModifyProduct, data, function (err, row) {
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

exports.reviewReplyDelete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.reviewReplyDelete, datas, function (err, row) {
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

exports.choiceList = function(page, done){
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.choiceListCnt, [], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
            /*var page = datas[0];*/
            var cnt = rows[0].cnt;
            var size = 10; //보여줄 글의 수
            var begin = (page - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((page - 1) * size);
            conn.query(sql.choiceList, [begin, size], function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows);
                var datas = {
                    title: "투표 리스트",
                    data: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                conn.release();
                done(datas);
            });
        });
    })
}


// 읽기
exports.choiceRead = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.choiceRead1, datas[0], function (err, rows) {
            if (err) logger.error('err', err);
            conn.query(sql.choiceRead2, datas[0], function (err, voteComments) {
                if (err) logger.error('err', err);
                var data = {
                    "voteNum": rows[0].voteNum,
                    "memberId" : rows[0].memberId,
                    "memberName" : rows[0].memberName,
                    "voteCategory" : rows[0].voteCategory,
                    "voteRegdate": rows[0].voteRegdate,
                    "voteContent1": rows[0].voteContent1,
                    "voteContent2": rows[0].voteContent2,
                    "voteContent3": rows[0].voteContent3,
                    "voteContent4": rows[0].voteContent4,
                    "voteContentCnt1" : rows[0].voteContentCnt1,
                    "voteContentCnt2" : rows[0].voteContentCnt2,
                    "voteContentCnt3" : rows[0].voteContentCnt3,
                    "voteContentCnt4" : rows[0].voteContentCnt4,
                    "voteTotalCnt" : rows[0].voteTotalCnt,
                    "votePicture1": choiceUrl + rows[0].votePicture1,
                    "votePicture2": choiceUrl + rows[0].votePicture2,
                    "votePicture3": choiceUrl + rows[0].votePicture3,
                    "votePicture4": choiceUrl + rows[0].votePicture4,
                    "finishFlag": rows[0].finishFlag,
                    "voteIsDeleted": rows[0].voteIsDeleted,
                    "voteComments" : voteComments
                 };
                conn.release();
                done(data);
             });
        })
    });
}

 exports.voteDelete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.voteDelete, datas, function (err, row) {
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

exports.voteReplyDelete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.voteReplyDelete, datas, function (err, row) {
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


exports.eventList = function(page, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
            return;
        }
        var sql = "select count(1) cnt from event";
        conn.query(sql, [], function (err, rows) {
            if (err) {
                logger.error('err', err);
                done(err);
                return;
            }
            logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
            var cnt = rows[0].cnt;
            var size = 10; //보여줄 글의 수
            var begin = (page - 1) * size; //시작 글 번호
            var totalPage = Math.ceil(cnt / size);
            var pageSize = 10; // 링크 갯수
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
            var endPage = startPage + (pageSize - 1); //끝 링크
            if (endPage > totalPage) {
                endPage = totalPage;
            }
            var max = cnt - ((page - 1) * size);
            var sql2 = "select eventNum, eventTitle, eventPicture, DATE_FORMAT(eventRegdate, '%Y-%m-%d %H:%i:%s') eventRegdate, eventIsDeleted " +
                "from event order by eventRegdate desc limit ?, ?";
            conn.query(sql2, [begin, size], function (err, rows) {
                if (err) {
                    logger.error('err', err);
                    done(err);
                    return;
                }
                logger.debug('rows', rows);
                var datas = {
                    data: rows,
                    page: page,
                    pageSize: pageSize,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: totalPage,
                    max: max
                };
                conn.release();
                done(null, datas);
            });
        });
    })
}



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

exports.eventDel = function(datas, done){
    pool.getConnection(function(err ,conn){
        if(err) {
            logger.error('err',err);
            done(err);
            return;
        }
        var sql = "update event set eventIsDeleted=? where eventNum=?";
        conn.query(sql, datas, function(err, row){
            if(err) {
                logger.error('err', err);
                done(err);
                return;
            }
            if(row.affectedRows==1){
                done(null);
            } else{
                done('err');
            }
            conn.release();
        })
    })
}
