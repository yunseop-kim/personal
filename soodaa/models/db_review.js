//db_review.js
var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');

var async = require('async');
var pool = mysql.createPool(db_config);

var reviewUrl = "http://52.68.92.194/images/uploads/review/";
var memberUrl = "http://52.68.92.194/images/uploads/member/";

exports.write2 = function (datas, done) {
    var success = false;
    pool.getConnection(function (err, connection) {
        if (err) {
            logger.error('err', err);
            done(err)
        }
        else {
            connection.beginTransaction(function (err) { // transaction 시작..
                if (err) {
                    logger.error('err', err);
                    done(err)
                }
                else {
                    async.waterfall([
                        function (callback) { //일단 제품명 새로 등록..
                            var sql1 = "INSERT INTO product (productName) " +
                                "SELECT * FROM (SELECT '" + datas[1] + "') AS tmp " +
                                "WHERE NOT EXISTS ( " +
                                "SELECT productName FROM product WHERE productName = '" + datas[1] + "'" +
                                ") LIMIT 1";
                            connection.query(sql1, [], function (err) {
                                if (err) {
                                    logger.error('err', err);
                                    callback(err);
                                } else {
                                    callback(null, datas[1]);
                                }
                            });
                        },
                        function (inputProduct, callback) { //등록된 제품의 번호 추출
                            var sql2 = "SELECT productNum from product where productName=?";
                            connection.query(sql2, inputProduct, function (err, row) {
                                if (err) {
                                    logger.error('err', err);
                                    callback(err);
                                } else {
                                    callback(null, row[0].productNum);
                                }
                            });
                        },
                        function (productNum, callback) {
                            datas[0] = productNum;  // 얻어온 제품번호 넣고
                            datas.splice(1, 1);    //inputProduct는 뺀다.
                            var sql3 = "INSERT INTO review (productNum, memberId, reviewContent, reviewWhere, reviewPrice, " +
                                "reviewKnowhow, reviewGood, reviewBad, reviewRecommandPeople, reviewStar, reviewThumbnail, reviewPicture1, reviewPicture2, " +
                                "reviewPicture3, reviewPicture4, reviewPicture5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            connection.query(sql3, datas, function (err, row) {
                                if (err) {
                                    callback(err);
                                } else if (row.affectedRows == 1) {
                                    callback(null);
                                } else {
                                    callback('err');
                                }
                            });
                        },
                        function (callback) {
                            var sql = "update member set rankWeek = rankWeek + 5, rankMonth = rankMonth + 5, rankTotal = rankTotal + 5" +
                                " where memberId = ?";
                            connection.query(sql, datas[1], function (err, row) {
                                if (err) {
                                    logger.error('err', err);
                                    callback(err);
                                } else {
                                    logger.debug('row', row);
                                    if (row.affectedRows == 1) {
                                        callback(null);
                                    } else {
                                        callback('err');
                                    }
                                }
                            })
                        }
                    ], function (err) {
                        if (err) {

                            connection.rollback(function () {
                                logger.debug('1 Rollback!! Error Caused!!');
                                connection.release();
                                done(err)
                            });
                        }//if
                        else {
                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        logger.debug('2 Rollback!! Error Caused!!');
                                        connection.release();
                                        done(err)
                                    });
                                } else {
                                    logger.debug('Commit Success!!');
                                    connection.release();
                                    done(null);

                                }
                            });
                        }
                    });
                }
            });//transaction
        }
    })//getConnection
};//function

exports.write = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
        } else {
            conn.beginTransaction(function (err) {
                if (err) {
                    logger.error('err', err);
                    done(err);
                } else {
                    async.waterfall([
                        function (callback) {
                            var sql = "INSERT INTO review (productNum, memberId, reviewContent, reviewWhere, reviewPrice, " +
                                "reviewKnowhow, reviewGood, reviewBad, reviewRecommandPeople, reviewStar, reviewThumbnail, reviewPicture1, reviewPicture2, " +
                                "reviewPicture3, reviewPicture4, reviewPicture5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                            conn.query(sql, datas, function (err, row) {
                                if (err) {
                                    logger.error('err', err);
                                    callback(err);
                                } else {
                                    logger.debug('row', row);
                                    if (row.affectedRows == 1) {
                                        callback(null);
                                    } else {
                                        callback('err');
                                    }
                                }
                            })
                        },
                        function (callback) {
                            var sql = "update member set rankWeek = rankWeek + 5, rankMonth = rankMonth + 5, rankTotal = rankTotal + 5" +
                                " where memberId = ?";
                            conn.query(sql, datas[1], function (err, row) {
                                if (err) {
                                    logger.error('err', err);
                                    callback(err);
                                } else {
                                    logger.debug('row', row);
                                    if (row.affectedRows == 1) {
                                        callback(null);
                                    } else {
                                        callback('err');
                                    }
                                }
                            })
                        }
                    ], function (err) {
                        if (err) {
                            conn.rollback(function () {
                                logger.error('err', err);
                            })
                            conn.release();
                            done(err);

                        } else {
                            conn.commit(function (err) {
                                if (err) {
                                    conn.rollback(function () {
                                        logger.debug('2 Rollback!! Error Caused!!');
                                        conn.release();
                                        done(err)
                                    });
                                } else {
                                    logger.debug('Commit Success!!');
                                    conn.release();
                                    done(null);

                                }
                            });
                        }
                    })

                }
            })

        }
    })
}

exports.list = function (datas, done) {
    pool.getConnection(function (err, conn) {
        var keyword = datas[3];
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message)
            return
        }
        switch (datas[2]) {
            case 1 : //최신순
                var sql1 = "select count(1) cnt from reviewListView where reviewIsDeleted=0";
                break;
            case 2 : //좋아요순
                var sql1 = "select count(1) cnt from reviewListView where reviewIsDeleted=0";
                break;
            case 3 : //내아이 맞춤
                var sql1 = "select count(1) cnt from reviewListView" + " where reviewIsDeleted=0 and " +
                    "productStartAge <= (datediff(now(), '"
                    + datas[3] + "')/30) and (datediff(now(), '" + datas[3] + "')/30) <= productEndAge";
                break;
            case 4 : // 카테고리 별
                var sql1 = "select count(1) cnt from reviewListView v where reviewIsDeleted=0 and  instr(productCategory1 , '" + keyword + "') > 0"
                break;
            case 5 : // 검색어 순
                var sql1 = "select count(1) cnt from reviewListView " +
                    "where reviewIsDeleted=0 and  instr(productName, '" + keyword + "') > 0 " +
                    "or instr(productBrand, '" + keyword + "') > 0 " +
                    "or instr(productCategory1, '" + keyword + "') > 0 " +
                    "or instr(productCategory2, '" + keyword + "') > 0"
                break;
        }
        conn.query(sql1, [], function (err, rows) {
            if (err) {
                logger.error('err', err);
                var message = "SQL1 에러"
                done(err, message)
                return;
            }
            //logger.debug('rows', rows);
            var cnt = rows[0].cnt;
            /*var size = datas[1] * 1;
             var begin = (datas[0] - 1) * size; //시작 글 번호
             var totalPage = Math.ceil(cnt / size);
             var pageSize = 10; // 링크 갯수
             var startPage = Math.floor((datas[0] - 1) / pageSize) * pageSize + 1; //시작 링크
             var endPage = startPage + (pageSize - 1); //끝 링크
             if (endPage > totalPage) {
             endPage = totalPage;
             }
             var max = cnt - ((datas[0] - 1) * size);*/
            var begin = datas[0] - 1;
            var size = datas[1];
            switch (datas[2]) {
                case 1 : //최신순
                    var sql2 = "select reviewNum, productName, productBrand, likeFlagCnt, reviewReplyCnt, reviewHit, " +
                        "reviewThumbnail from reviewListView where reviewIsDeleted=0 order by reviewRegdate desc limit ?,?";
                    break;
                case 2 : //좋아요순
                    var sql2 = "select reviewNum, productName, productBrand, likeFlagCnt, reviewReplyCnt, reviewHit, " +
                        "reviewThumbnail from reviewListView where reviewIsDeleted=0 order by likeFlagCnt desc limit ?,?";
                    break;
                case 3 : //내아이 맞춤
                    var sql2 = "select reviewNum, productName, productBrand, likeFlagCnt, reviewReplyCnt, reviewHit, " +
                        "reviewThumbnail from reviewListView where reviewIsDeleted=0 and " +
                        "productStartAge <= (datediff(now(), '" + keyword + "')/30)  and " +
                        "(datediff(now(), '" + keyword + "')/30) <= productEndAge order by likeFlagCnt desc limit ?,?";
                    break;
                case 4 : // 카테고리 별
                    var sql2 = "select reviewNum, productName, productBrand, likeFlagCnt, reviewReplyCnt, reviewHit, reviewThumbnail " +
                        "from reviewListView v where reviewIsDeleted=0 and instr(productCategory1 , '" + keyword + "') > 0 " +
                        "order by likeFlagCnt desc limit ?,?";
                    break;
                case 5 : // 검색어 순
                    var sql2 = "select reviewNum, productName, productBrand, likeFlagCnt, reviewReplyCnt, reviewHit, reviewThumbnail " +
                        "from reviewListView where reviewIsDeleted=0 and instr(productName, '" + keyword + "') > 0 " +
                        "or instr(productBrand, '" + keyword + "') > 0 " +
                        "or instr(productCategory1, '" + keyword + "') > 0 " +
                        "or instr(productCategory2, '" + keyword + "') > 0 " +
                        "order by likeFlagCnt desc limit ?,?";
                    break;
            }
            conn.query(sql2, [begin, size], function (err, rows) {
                if (err) {
                    logger.error('err', err);
                    var message = "SQL2 에러"
                    done(err, message)
                    return;
                }
                // logger.debug('rows', rows);
                var data = [];
                var message = "리스트 성공";
                for (var i = 0; i < rows.length; i++) {
                    data[i] = {
                        "reviewNum": rows[i].reviewNum,
                        "productName": (rows[i].productName + ' ' + rows[i].productBrand).trim(),
                        "reviewPicture": reviewUrl + rows[i].reviewThumbnail,
                        "likeFlagCnt": rows[i].likeFlagCnt,
                        "reviewReplyCnt": rows[i].reviewReplyCnt,
                        "reviewHit": rows[i].reviewHit
                    }
                }
                conn.release();
                done(null, message, data, cnt);
            });
        });
    });
}

exports.regsearch = function (keyword, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        var sql = "INSERT INTO search (searchQuery, queryCount) VALUES(RTRIM(LTRIM(?)), 1) ON DUPLICATE KEY UPDATE queryCount=queryCount+1";
        conn.query(sql, keyword, function (err, row) {
            if (err) {
                logger.error('err', err);
                var message = "SQL 에러"
                done(err, message)
                return;
            }
            logger.debug('row', row);
            var success = 0;
            var message = "검색 실패"
            if (row.affectedRows >= 1) {
                success = 1;
                message = "검색 성공"
            }
            done(err, message, success);
            conn.release();
        });
    });
}

exports.read = function (datas, callback) {
    var sql0 = 'update review set reviewHit = reviewHit+1 where reviewNum=?';
    var sql1 = "select reviewNum, memberId, memberName, memberPicture, DATE_FORMAT(reviewRegdate, '%Y-%m-%d %H:%i:%s') reviewRegdate, likeFlagCnt, reviewHit, reviewStar, productName, productBrand, " +
        "reviewWhere,reviewPrice,reviewKnowhow, reviewGood, reviewBad, reviewRecommandPeople, reviewContent, reviewPicture1," +
        "reviewPicture2, reviewPicture3, reviewPicture4, reviewPicture5 from reviewListView where reviewNum=?";
    var sql2 = "select count(1) isReaderLike  from like_flag where reviewNum = ? and memberId = ? and like_flag=1";
    var sql3 = "select count(1) isReaderZzim from zzim_flag where reviewNum = ? and memberId = ? and zzimflag=1";
    var sql4 = "select count(1) isReaderReport from reportFlag where reviewNum = ? and memberId = ?";

    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
        } else {
            conn.beginTransaction(function (err) {
                if (err) {
                    conn.rollback(function () {
                        callback(err);
                        return;
                    });
                }
                async.parallel(
                    {
                        message: function (done) {
                            conn.query(sql0, datas[0], function (err, row) {
                                if (err) callback(err);
                                if (row.affectedRows == 1) {
                                    done(null);
                                }
                            });
                        },
                        data: function (done) {
                            conn.query(sql1, datas[0], function (err, row) {
                                if (err) callback(err);
                                row[0].memberPicture = memberUrl + row[0].memberPicture;
                                row[0].reviewPicture1 = reviewUrl + row[0].reviewPicture1;
                                row[0].reviewPicture2 = reviewUrl + row[0].reviewPicture2;
                                row[0].reviewPicture3 = reviewUrl + row[0].reviewPicture3;
                                row[0].reviewPicture4 = reviewUrl + row[0].reviewPicture4;
                                row[0].reviewPicture5 = reviewUrl + row[0].reviewPicture5;
                                done(null, row[0]);
                            });
                        },
                        isReaderLike: function (done) {
                            conn.query(sql2, datas, function (err, row) {
                                if (err) callback(err);
                                done(null, row[0]);
                            });
                        },
                        isReaderZzim: function (done) {
                            conn.query(sql3, datas, function (err, row) {
                                if (err) callback(err);
                                done(null, row[0]);
                            });
                        },
                        isReaderReport: function (done) {
                            conn.query(sql4, datas, function (err, row) {
                                if (err) callback(err);
                                done(null, row[0]);
                            });
                        }
                    }, function (err, result) {
                        if (err) {
                            conn.rollback(function () {
                                callback(err);
                            });
                        } else {
                            conn.commit(function (err) {
                                if (err) {
                                    conn.rollback(function () {
                                        callback(err);
                                    });
                                } else {
                                    result.data = extend({}, result.data, result.isReaderLike);
                                    result.data = extend({}, result.data, result.isReaderZzim);
                                    result.data = extend({}, result.data, result.isReaderReport);
                                    var data = result.data;
                                    logger.debug("result_data", data);
                                    callback(null, data);
                                }
                            });
                        }
                    }); //async
                conn.release();
            });  //transaction
        }
    });
};

exports.modify = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러"
            done(err, message);
            return;
        }
        var sql1 = "select count(*) chk from review where reviewNum=? and memberId=?";
        conn.query(sql1, [datas[8], datas[9]], function (err, check) {
            if (err) {
                logger.error('err', err);
                var message = "SQL1 에러";
                done(err, message);
                return;
            }
            logger.debug('check', check);
            if (check[0].chk == 0) {
                var success = 2;
                var message = "내 글이 아닙니다";
                done(null, message, success);
                conn.release();
            } else {
                var sql2 = "UPDATE review SET reviewContent=?, reviewWhere=?, reviewPrice=?," +
                    " reviewKnowhow=?, reviewGood=?, reviewBad=?, reviewRecommandPeople=?, reviewStar=?," +
                    " reviewModifydate=now() where reviewNum=? and memberId=?";
                conn.query(sql2, datas, function (err, row) {
                    if (err) {
                        logger.error('err', err);
                        var message = "SQL2 에러";
                        done(err, message);
                        return;
                    }
                    logger.debug('row', row);
                    var success = 0;
                    var message = "수정 실패";
                    if (row.affectedRows == 1) {
                        success = 1;
                        message = "수정 성공";
                    }
                    done(null, message, success);
                    conn.release();
                })
            }
        })
    })
};

exports.delete = function (datas, done) {
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
                done(err);
            } else {
                async.waterfall([
                    function (callback) {
                        var sql = "UPDATE review SET reviewIsDeleted=1 where reviewNum=? and memberId=?";
                        conn.query(sql, datas, function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else {
                                logger.debug('row', row);
                                if (row.affectedRows == 1) {
                                    callback(null);
                                } else {
                                    callback('err');
                                }
                            }
                        })
                    },
                    function (callback) {
                        var sql = "UPDATE member SET   rankWeek = if(rankWeek < 5 , 0 , rankWeek-5), rankMonth = " +
                            "if(rankMonth < 5 , 0 , rankMonth-5), rankTotal = if(rankTotal < 5 , 0 , rankTotal-5) " +
                            "WHERE memberId=?";
                        conn.query(sql, datas[1], function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else {
                                logger.debug('row', row);
                                if (row.affectedRows == 1) {
                                    callback(null);
                                } else {
                                    callback('err');
                                }
                            }
                        })
                    }
                ], function (err) {
                    if (err) {
                        conn.rollback(function () {
                            logger.error('err', err);
                            conn.release();
                            done(err);
                        })
                    } else {
                        conn.commit(function (err) {
                            if (err) {
                                conn.rollback(function () {
                                    logger.debug('2 Rollback!! Error Caused!!');
                                    conn.release();
                                    done(err)
                                });
                            } else {
                                logger.debug('Commit Success!!');
                                conn.release();
                                done(null);

                            }
                        });
                    }
                })

            }
        })
    })
}


exports.replyList = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            var message = "DB 연결 중 에러";
            done(err, message);
            return;
        }
        var sql1 = "select count(*) cnt from rev_reply where reviewNum=?";
        conn.query(sql1, datas[2], function (err, rows) {
            if (err) {
                logger.error('err', err);
                var message = "SQL1 에러";
                done(err, message);
                return;
            }
            logger.debug('rows', rows);
            var cnt = rows[0].cnt;
            /*var size = datas[1] * 1;
             var begin = (datas[0] - 1) * size; //시작 글 번호
             var totalPage = Math.ceil(cnt / size);
             var pageSize = 10; // 링크 갯수
             var startPage = Math.floor((datas[0] - 1) / pageSize) * pageSize + 1; //시작 링크
             var endPage = startPage + (pageSize - 1); //끝 링크
             if (endPage > totalPage) {
             endPage = totalPage;
             }*/
            var begin = datas[0] - 1;
            var size = datas[1];
            // var max = cnt - ((datas[0] - 1) * size);
            var sql2 = "select rr.reviewReplyNum, mem.memberPicture, mem.memberName,  DATE_FORMAT(rr.reviewReplyRegdate, '%Y-%m-%d %H:%i:%s') reviewReplyRegdate, " +
                "rr.reviewReplyContent from rev_reply rr, member mem where rr.reviewNum=? and rr.reviewReplyIsDeleted=0 " +
                "and rr.memberId = mem.memberId order by reviewReplyRegdate asc limit ?,?";
            conn.query(sql2, [datas[2], begin, size], function (err, rows) {
                if (err) {
                    logger.error('err', err);
                    var message = "SQL2 에러";
                    done(err, message);
                    return;
                }
                logger.debug('rows', rows);
                var message = "댓글리스트 성공"
                var data = [];
                for (var i = 0; i < rows.length; i++) {
                    data[i] = {
                        "reviewReplyNum": rows[i].reviewReplyNum,
                        "memberPicture": memberUrl + rows[i].memberPicture,
                        "memberName": rows[i].memberName,
                        "reviewReplyRegdate": changeTime(rows[i].reviewReplyRegdate),
                        "reviewReplyContent": rows[i].reviewReplyContent
                    }
                }
                conn.release();
                done(null, message, data, cnt);
            });
        })
    })
}

exports.reply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
        } else {
            conn.beginTransaction(function (err) {
                if (err) {
                    conn.rollback(function () {
                        logger.error('err', err);
                        done(err);
                        return;
                    });
                }
                async.waterfall([
                    function (callback) {
                        var sql = "INSERT INTO rev_reply (reviewNum, memberId, reviewReplyContent) VALUES (?, ?, ?);";
                        conn.query(sql, datas, function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else if (row.affectedRows == 1) {
                                callback(null);
                            } else {
                                callback('err');
                            }
                        })
                    },
                    function (callback) {
                        var sql2 = "select memberId from review where reviewNum=?";
                        conn.query(sql2, datas[0], function (err, receiver) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else {
                                logger.debug('receiver', receiver);
                                callback(null, receiver[0].memberId);
                            }
                        })

                    },
                    function (memberId, callback) {
                        var sql3 = "insert into gcm (senderId, receiverId, tmpIndex, type) values(?,?,?,3)"
                        conn.query(sql3, [datas[1], memberId, datas[0]], function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else if (row.affectedRows == 1) {
                                callback(null, memberId);
                            } else {
                                callback('err');
                            }
                        })

                    },
                    function (memberId, callback) {
                        var sql4 = "update member set rankWeek = rankWeek + 3, rankMonth = rankMonth + 3, rankTotal = rankTotal + 3" +
                            " where memberId = ?";
                        conn.query(sql4, memberId, function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else if (row.affectedRows == 1) {
                                callback(null);
                            } else {
                                callback('err');
                            }
                        })
                    }
                ], function (err) {
                    if (err) {
                        conn.rollback(function () {
                            logger.error('err', err);
                        })
                        conn.release();
                        done(err);

                    } else {
                        conn.commit(function (err) {
                            if (err) {
                                conn.rollback(function () {
                                    logger.debug('2 Rollback!! Error Caused!!');
                                    conn.release();
                                    done(err)
                                });
                            } else {
                                logger.debug('Commit Success!!');
                                conn.release();
                                done(null);

                            }
                        });
                    }
                })

            })
        }
    });
};


exports.delReply = function (datas, done) {
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
                done(err);
            } else {
                async.waterfall([
                    function (callback) {
                        var sql = "UPDATE rev_reply SET reviewReplyIsDeleted=1 WHERE reviewReplyNum=? and memberId=?";
                        conn.query(sql, datas, function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else {
                                logger.debug('row', row);
                                if (row.affectedRows == 1) {
                                    callback(null);
                                } else {
                                    callback('err');
                                }
                            }
                        })
                    },
                    function (callback) {
                        var sql = "select reviewNum from rev_reply where reviewReplyNum =?";
                        conn.query(sql, datas[0], function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else {
                                logger.debug('row', row);
                                callback(null, row[0].reviewNum);
                            }
                        })
                    },
                    function (reviewNum, callback) {
                        var sql = "select memberId from review where reviewNum=?";
                        conn.query(sql, reviewNum, function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else {
                                logger.debug('row', row);
                                callback(null, row[0].memberId);
                            }
                        })
                    },
                    function (memberId, callback) {
                        var sql = "UPDATE member SET   rankWeek = if(rankWeek < 3 , 0 , rankWeek-3), rankMonth = " +
                            "if(rankMonth < 3 , 0 , rankMonth-3), rankTotal = if(rankTotal < 3 , 0 , rankTotal-3) " +
                            "WHERE memberId=?";
                        conn.query(sql, memberId, function (err, row) {
                            if (err) {
                                logger.error('err', err);
                                callback(err);
                            } else {
                                logger.debug('row', row);
                                if (row.affectedRows == 1) {
                                    callback(null);
                                } else {
                                    callback('err');
                                }
                            }
                        })
                    }
                ], function (err) {
                    if (err) {
                        conn.rollback(function () {
                            logger.error('err', err);
                            conn.release();
                            done(err);
                        })
                    } else {
                        conn.commit(function (err) {
                            if (err) {
                                conn.rollback(function () {
                                    logger.debug('2 Rollback!! Error Caused!!');
                                    conn.release();
                                    done(err)
                                });
                            } else {
                                logger.debug('Commit Success!!');
                                conn.release();
                                done(null);

                            }
                        });
                    }
                })

            }
        })
    })
}


exports.like1 = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
            return;
        }
        conn.beginTransaction(function (err) {
            if (err) {
                logger.error('err', err);
                done(err);
                return;
            }
            async.waterfall([
                function (callback) {
                    var sql1 = "INSERT INTO like_flag (reviewNum, memberId,  like_flag) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE like_flag = ?";
                    conn.query(sql1, datas, function (err, row) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        if (row.affectedRows >= 1) {
                            callback(null);
                        } else {
                            callback('err sql1');
                        }
                    })
                },
                function (callback) {
                    var sql2 = "select memberId from review where reviewNum=?";
                    conn.query(sql2, datas[0], function (err, receiver) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        var memberId = receiver[0].memberId;
                        callback(null, memberId);
                    })
                },
                function (memberId, callback) {
                    var sql3 = "insert into gcm (senderId, receiverId, tmpIndex, type) values(?,?,?,2)";
                    conn.query(sql3, [datas[1], memberId, datas[0]], function (err, gcm) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        if (gcm.affectedRows == 1) {
                            callback(null, memberId);
                        } else {
                            callback('err sql3');
                        }
                    })

                },
                function (memberId, callback) {
                    var sql4 = "update member set rankWeek = rankWeek + 1, rankMonth = rankMonth + 1, rankTotal = rankTotal + 1" +
                        " where memberId = ?";
                    conn.query(sql4, memberId, function (err, rank) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        if (rank.affectedRows == 1) {
                            callback(null);
                        } else {
                            callback('err sql4');
                        }
                    })
                }
            ], function (err) {
                if (err) {
                    conn.rollback(function () {
                        done(err);
                        conn.release();
                    })
                } else {
                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function () {
                                logger.error('err', err);
                                done(err);
                                conn.release();
                            });
                        } else {
                            done(null);
                            conn.release();
                        }
                    })
                }
            })
        })
    })
}

exports.like2 = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
            return;
        }
        conn.beginTransaction(function (err) {
            if (err) {
                logger.error('err', err);
                done(err);
                return;
            }
            async.waterfall([
                function (callback) {
                    var sql1 = "INSERT INTO like_flag (reviewNum, memberId,  like_flag) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE like_flag = ?";
                    conn.query(sql1, datas, function (err, row) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        if (row.affectedRows >= 1) {
                            callback(null);
                        } else {
                            callback('err sql1');
                        }
                    })
                },
                function (callback) {
                    var sql2 = "delete from gcm where senderId=? and tmpIndex=? and type=2";
                    conn.query(sql2, [datas[1], datas[0]], function (err, cancel) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        if (cancel.affectedRows >= 1) {
                            callback(null);
                        } else {
                            callback('err sql2');
                        }
                    })
                },
                function (callback) {
                    var sql3 = "select memberId from review where reviewNum=?";
                    conn.query(sql3, datas[0], function (err, receiver) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        var memberId = receiver[0].memberId;
                        callback(null, memberId);
                    })
                },
                function (memberId, callback) {
                    var sql4 = "UPDATE member SET   rankWeek = if(rankWeek < 1 , 0 , rankWeek-1), rankMonth = " +
                        "if(rankMonth < 1 , 0 , rankMonth-1), rankTotal = if(rankTotal < 1 , 0 , rankTotal-1) " +
                        "WHERE memberId=?";
                    conn.query(sql4, memberId, function (err, rank) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        if (rank.affectedRows >= 1) {
                            callback(null);
                        } else {
                            callback('err sql4');
                        }
                    })
                }
            ], function (err) {
                if (err) {
                    conn.rollback(function () {
                        done(err);
                        conn.release();
                    })
                } else {
                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function () {
                                logger.error('err', err);
                                done(err);
                                conn.release();
                            });
                        } else {
                            done(null);
                            conn.release();
                        }
                    })
                }
            })
        })
    })
}

//
//exports.like = function (datas, done) {
//    pool.getConnection(function (err, conn) {
//        if (err) {
//            logger.error('err', err);
//            done(false);
//        } else {
//            conn.beginTransaction(function (err) {
//                if (err) {
//                    conn.rollback(function () {
//                        logger.error('err', err);
//                        done(false);
//                        return;
//                    });
//                }
//                var sql = "INSERT INTO like_flag (reviewNum, memberId,  like_flag) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE like_flag = ?";
//                conn.query(sql, datas, function (err, row) {
//                    if (err) {
//                        conn.rollback(function () {
//                            logger.error('err', err);
//                            done(false);
//                            return;
//                        });
//                    }
//                    logger.debug('row', row);
//                    if (row.affectedRows >= 1) {
//                        if (datas[2] == 1) {
//                            var sql2 = "select memberId from review where reviewNum=?";
//                            conn.query(sql2, datas[0], function (err, receiver) {
//                                if (err) {
//                                    conn.rollback(function () {
//                                        logger.error('err', err);
//                                        done(false);
//                                        return;
//                                    });
//                                }
//                                var sql3 = "insert into gcm (senderId,receiverId, tmpIndex, type) values(?,?,?,2)";
//                                conn.query(sql3, [datas[1], receiver[0].memberId, datas[0]], function (err, rows) {
//                                    if (err) {
//                                        conn.rollback(function () {
//                                            logger.error('err', err);
//                                            done(false);
//                                            return;
//                                        });
//                                    }
//                                    var success = false;
//                                    if (rows.affectedRows >= 1) {
//                                        success = true;
//                                        var sql4 = "update member set rankWeek = rankWeek + 3, rankMonth = rankMonth + 3, rankTotal = rankTotal + 3" +
//                                            " where memberId = ?"
//                                        conn.query(sql4, receiver[0].memberId, function(err, row) {
//                                            if(err) {
//                                                conn.rollback(function() {
//                                                    logger.error('err',err);
//                                                    done(false);
//                                                    return;
//                                                });
//                                            }
//                                            if(row.affectedRows){
//
//                                            }
//                                        })
//                                    }
//                                    conn.commit(function (err) {
//                                        if (err) {
//                                            conn.rollback(function () {
//                                                logger.error('err', err);
//                                                done(false);
//                                            });
//                                        }
//                                        done(success);
//                                        conn.release();
//                                    })
//                                })
//                            })
//                        } else {
//                            var sql4 = "delete from gcm where senderId=? and tmpIndex=?"
//                            conn.query(sql4, [datas[1], datas[0]], function (err, cancel) {
//                                if (err) {
//                                    conn.rollback(function () {
//                                        logger.error('err', err);
//                                        done(false);
//                                        return;
//                                    });
//                                }
//                                var success = false;
//                                if (cancel.affectedRows >= 1) {
//                                    success = true;
//                                }
//                                conn.commit(function (err) {
//                                    if (err) {
//                                        conn.rollback(function () {
//                                            logger.error('err', err);
//                                            done(false);
//                                        });
//                                    }
//                                    done(success);
//                                    conn.release();
//                                })
//
//                            })
//                        }
//                    }
//                })
//            })
//
//        }
//
//    })
//}

//
//exports.zzim = function (datas, done) {
//    pool.getConnection(function (err, conn) {
//        if (err) logger.error('err', err);
//        var sql = "INSERT INTO zzim_flag (memberId, reviewNum, zzimflag) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE zzimflag = ?";
//        conn.query(sql, datas, function (err, row) {
//            if (err) logger.error('err', err);
//            logger.debug('row', row);
//            var success = false;
//            if (row.affectedRows >= 1) {
//                success = true;
//            }
//            done(success);
//            conn.release();
//        })
//    })
//}

exports.zzim1 = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
            return;
        }
        conn.beginTransaction(function (err) {
            if (err) {
                logger.error('err', err);
                done(err);
                return;
            }
            async.waterfall([
                function (callback) {
                    var sql1 = "INSERT INTO zzim_flag (memberId, reviewNum, zzimflag) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE zzimflag = ?";
                    conn.query(sql1, datas, function (err, row) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        logger.debug('row', row);
                        if (row.affectedRows >= 1) {
                            callback(null);
                        } else {
                            callback("err sql1");
                        }
                    })
                },
                function (callback) {
                    var sql2 = "select memberId from review where reviewNum=?";
                    conn.query(sql2, datas[1], function (err, receiver) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        var memberId = receiver[0].memberId;
                        callback(null, memberId);
                    })
                },
                function (memberId, callback) {
                    if(datas[2]==1){
                        var sql3 = "update member set rankWeek = rankWeek + 3, rankMonth = rankMonth + 3, rankTotal = rankTotal + 3" +
                            " where memberId = ?";
                    } else {
                        var sql3 = "UPDATE member SET   rankWeek = if(rankWeek < 3 , 0 , rankWeek-3), rankMonth = " +
                            "if(rankMonth < 3 , 0 , rankMonth-3), rankTotal = if(rankTotal < 3 , 0 , rankTotal-3) " +
                            "WHERE memberId=?";
                    }
                    conn.query(sql3, memberId, function (err, rank) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                            return;
                        }
                        if (rank.affectedRows == 1) {
                            callback(null);
                        } else {
                            callback('err sql3');
                        }
                    })
                }
            ], function (err) {
                if (err) {
                    conn.rollback(function () {
                        done(err);
                        conn.release();
                    })
                } else {
                    conn.commit(function (err) {
                        if (err) {
                            conn.rollback(function () {
                                logger.error('err', err);
                                done(err);
                                conn.release();
                            });
                        } else {
                            done(null);
                            conn.release();
                        }
                    })
                }
            })

        })
    })
}


exports.report = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "INSERT INTO reportFlag (memberId, reviewNum, reportContent) VALUES (?, ?, ?)";
        conn.query(sql, datas, function (err, row) {
            if (err) {
                logger.error('err', err);
                done(false);
                conn.release();
                return;
            }
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

exports.popularQuery = function (done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        var sql = "select searchQuery from search order by querycount desc limit 10";
        conn.query(sql, function (err, rows) {
            if (err) {
                logger.error('err', err);
                return;
            }
            logger.debug('rows', rows);
            conn.release();
            done(null, rows);
        });
    });
}


exports.productSearch = function(datas, done) {
    pool.getConnection(function(err, conn) {
        if(err) {
            logger.error('err', err);
            done(err);
            return;
        }
        var sql = "select productNum, productName, productBrand, productCategory1 from product where instr(productCategory1, ?) > 0";
        conn.query(sql, datas, function(err, rows) {
            if(err) {
                logger.error('err', err);
                done(err);
                return;
            }
            logger.debug('rows',rows);
            done(null, rows);
            conn.release();

        })
    })
}


exports.productName = function(datas, done) {
    pool.getConnection(function(err, conn) {
        if(err) {
            logger.error('err', err);
            done(err);
            return;
        }
        var sql = "select productNum from product where productName like ?";
        conn.query(sql, datas, function(err, row){
            if(err) {
                logger.error('err', err);
                done(err);
                return;
            }
            logger.debug('row', row);
            if(row.length>0){
                var data = row[0].productNum;
            } else {
                var data = -1
            }
            done(null, data);
        })

    })
}

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

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}
