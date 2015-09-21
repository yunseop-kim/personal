//db_choice.js
var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');
var sql = require('./sql');

var pool = mysql.createPool(db_config);
var choiceUrl = "http://52.68.92.194/images/uploads/choice/";
var memberUrl = "http://52.68.92.194/images/uploads/member/";

exports.list = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.choiceListCnt, [], function (err, rows) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }

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
            //[0 : 전체보기/ 1 : 육아/ 2 : 제품서비스/ 3 : 임신 / 4: 의료 / 5: 최다참여자 / 6: 내가쓴글]
            var max = cnt - ((datas[0] - 1) * size);
            if (datas[2] == 0) {
                var db_choiceList = sql.db_choiceList + "order by voteRegdate desc limit ?, ?";
            } else if (datas[2] == 5) {
                var db_choiceList = sql.db_choiceList + "order by voteTotalCnt desc limit ?, ?"
            } else if (datas[2] == 6) {
                var db_choiceList = sql.db_choiceList + "and memberId='" + datas[3] + "' order by voteNum desc limit ?, ?"
            } else {
                var db_choiceList = sql.db_choiceList + "and voteCategory=" + datas[2] + " order by voteRegdate desc limit ?, ?";
            }
            conn.query(db_choiceList, [begin, size], function (err, rows) {
                if (err) {
                    logger.error('err', err);
                    var message = "SQL2 에러";
                    done(err, message);
                    return;
                }
                var message = "초이스 리스트 성공";
                conn.release();
                done(null, message, rows);
            });
        });
    });
};

exports.write = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.db_choiceWrite, datas, function (err, row) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            var success = false;
            var message = "초이스 쓰기 실패"
            if (row.affectedRows == 1) {
                success = true;
                message = "초이스 쓰기 성공"
            }
            done(null, message, success);
            conn.release();
        });
    });
};

/*
 아래 read 기능에서는 다음과 같은 경우를 생각해야 한다. 투표 중인 것, 투표가 마감이 된 것. 이렇게 두가지이다.
 아래 read 기능은, 투표 중일 때 화면을 뿌려주는 경우로서, finishFlag로 구분을 한다.
 flag의 경우는 내가 투표를 했나, 안 했나를 알려주는 변수이다.
 만일 마감이 된 경우라면, 화면 단에서
 finishFlag를 통해서 결과보기 버튼을 만들어 주던지... 그렇게 한다. [결과 보기] 화면 용 function은 이 다음 function에서 정의한다.
 */
exports.read = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.db_choiceRead, datas, function (err, row) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            var data = {
                "voteTitle": row[0].voteTitle,
                "voteContent1": row[0].voteContent1,
                "voteContent2": row[0].voteContent2,
                "voteContent3": row[0].voteContent3,
                "voteContent4": row[0].voteContent4,
                "votePicture1": choiceUrl + row[0].votePicture1,
                "votePicture2": choiceUrl + row[0].votePicture2,
                "votePicture3": choiceUrl + row[0].votePicture3,
                "votePicture4": choiceUrl + row[0].votePicture4,
                "memberName": row[0].memberName,
                "memberPicture": memberUrl + row[0].memberPicture,
                "voteFlag": row[0].flag,
                "finishFlag": row[0].finishFlag
            }
            var message = "초이스 읽기 성공"
            done(null, message, data);
            conn.release();
        });
    });
};

exports.readResult = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.db_choiceReadResult, datas, function (err, row) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            // logger.debug('row', row);
            var data = {
                "voteTitle": row[0].voteTitle,
                "memberName": row[0].memberName,
                "memberPicture": memberUrl + row[0].memberPicture,
                "voteContent1": row[0].voteContent1,
                "voteContent2": row[0].voteContent2,
                "voteContent3": row[0].voteContent3,
                "voteContent4": row[0].voteContent4,
                "votePicture1": choiceUrl + row[0].votePicture1,
                "votePicture2": choiceUrl + row[0].votePicture2,
                "votePicture3": choiceUrl + row[0].votePicture3,
                "votePicture4": choiceUrl + row[0].votePicture4,
                "result1": row[0].result1,
                "result2": row[0].result2,
                "result3": row[0].result3,
                "result4": row[0].result4
            }
            var message = "초이스 결과 보기 성공"
            done(null, message, data);
            conn.release();
        });
    });
}

//삭제
exports.delete = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.db_choiceDelete, datas, function (err, row) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            var success = false;
            var message = "초이스 삭제 실패"
            if (row.affectedRows == 1) {
                success = true;
                message = "초이스 삭제 성공"
            }
            done(null, message, success);
            conn.release();
        });
    });
};

//댓글 쓰기
exports.reply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.beginTransaction(function (err) {
            if (err) {
                logger.error('err', err);
                var message = "트랜잭션 시작 에러"
                done(err, message);
                return;
            }
            conn.query(sql.db_choiceReply, datas, function (err, row) {
                if (err) {
                    conn.rollback(function () {
                        logger.error('err', err);
                    });
                    var message = "SQL1 에러";
                    done(err, message);
                    return;
                }
                if (row.affectedRows == 1) {
                    conn.query(sql.db_choiceGetMemberId, datas[0], function (err, receiver) {
                        if (err) {
                            conn.rollback(function () {
                                logger.error('err', err);
                            });
                            var message = "SQL2 에러";
                            done(err, message);
                            return;
                        }
                        conn.query(sql.db_choiceGCM, [datas[1], receiver[0].memberId, datas[0]], function (err, rows) {
                            if (err) {
                                conn.rollback(function () {
                                    logger.error('err', err);
                                });
                                var message = "SQL3 에러";
                                done(err, message);
                                return;
                            }
                            var success = false;
                            var message = "초이스 댓글 쓰기 실패"
                            if (rows.affectedRows == 1) {
                                success = true;
                                message = "초이스 댓글 쓰기 성공"
                            }
                            conn.commit(function (err) {
                                if (err) {
                                    conn.rollback(function () {
                                        logger.error('err', err);
                                    });
                                    var message = "COMMIT 에러"
                                    done(err, message);
                                    return;
                                }
                            })
                            done(null, message, success);
                            conn.release();
                        });
                    });
                }
            });
        });
    });
};

//초이스 댓글 리스트
exports.replyList = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.db_choiceReplyCnt, [datas[2]], function (err, rows) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
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
            conn.query(sql.db_choiceViewReply, [datas[2], begin, size], function (err, rows) {
                if (err) {
                    logger.error('err', err);
                    var message = "SQL2 에러";
                    done(err, message);
                    return;
                }
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    data[i] = {
                        "voteReplyNum": rows[i].voteReplyNum,
                        "memberName": rows[i].memberName,
                        "memberPicture": memberUrl + rows[i].memberPicture,
                        "voteReplyContent": rows[i].voteReplyContent,
                        "voteReplyRegdate": rows[i].voteReplyRegdate
                    }
                }
                var message = "초이스 댓글 성공"
                conn.release();
                done(null, message, data);
            });
        });
    });
};

// 댓글 삭제
exports.delReply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        conn.query(sql.db_choiceDelReply, datas, function (err, row) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러";
                done(err, message);
                return;
            }
            var success = false;
            var message = "초이스 댓글 삭제 실패"
            if (row.affectedRows == 1) {
                success = true;
                message = "초이스 댓글 삭제 성공"
            }
            done(null, message, success);
            conn.release();
        });
    });
};

//투표하기
exports.vote = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러";
            done(err, message);
            return;
        }

        conn.beginTransaction(function (err) {
            if (err) {
                logger.error('err', err);
                var message = "트랜잭션 시작 에러";
                done(err, message);
                return;
            }
            var sql = "INSERT INTO vote_flag (memberId, voteNum) VALUES (?, ?)";
            conn.query(sql, [datas[0], datas[1]], function (err, row) {
                if (err) {
                    conn.rollback(function () {
                        logger.error('err', err);
                    });
                    var message = "SQL1 에러";
                    done(err, message);
                    return;
                }
                logger.debug('row', row);
                var sql2 = "UPDATE vote SET voteContentCnt" + datas[2] + "=voteContentCnt" + datas[2] + "+1 WHERE voteNum=?";
                conn.query(sql2, [datas[1]], function (err, rows) {
                    if (err) {
                        conn.rollback(function () {
                            logger.error('err', err);
                        });
                        var message = "SQL2 에러";
                        done(err, message);
                        return;
                    }
                    logger.debug('rows', rows);
                    var success = false;
                    var message = "초이스 투표 실패"
                    if (rows.affectedRows >= 1) {
                        success = true;
                        message = "초이스 투표 성공"
                    }
                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function () {
                                logger.error('err', err);
                            });
                            var message = "COMMIT 에러"
                            done(err, message);
                            return;
                        }
                    })
                    done(null, message, success);
                    conn.release();
                });
            });
        })

    });
};