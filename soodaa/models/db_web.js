var mysql = require('mysql');
var db_config = require('./db_config');
var logger = require('../etc/logger');
var async = require('async');

var pool = mysql.createPool(db_config);
var memberUrl = "http://52.68.92.194/images/uploads/member/";
var reviewUrl = "http://52.68.92.194/images/uploads/review/";

var sql = require('./sql');

exports.index = function (datas, done) {
    pool.getConnection(function (err, conn) {
        conn.query(sql.myInform, datas[0], function (err, data) {
            if (err) logger.error('err', err);
            //tmp.push(rows[0]);
            conn.query(sql.reviewCnt, [], function (err, rows) {
                if (err) logger.error('err', err);
                var cnt = rows[0].cnt;
                var size = 18; //보여줄 글의 수
                var begin = (datas[1] - 1) * size; //시작 글 번호
                var totalPage = Math.ceil(cnt / size);
                var pageSize = 10; // 링크 갯수
                var startPage = Math.floor((datas[1] - 1) / pageSize) * pageSize + 1; //시작 링크
                var endPage = startPage + (pageSize - 1); //끝 링크
                if (endPage > totalPage) {
                    endPage = totalPage;
                }
                var max = cnt - ((datas[1] - 1) * size);
                conn.query(sql.reviewPaging, [begin, size], function (err, paging) {
                    if (err) logger.error('err', err);
                    var review = [];
                    for (var i = 0; i < paging.length; i++) {
                        review[i] = {
                            "reviewNum": paging[i].reviewNum,
                            "productName": paging[i].productName,
                            "productBrand": paging[i].productBrand,
                            "memberName": paging[i].memberName,
                            "memberId": paging[i].memberId,
                            "reviewPicture": reviewUrl + paging[i].reviewThumbnail,
                            "likeFlagCnt": paging[i].likeFlagCnt,
                            "reviewReplyCnt": paging[i].reviewReplyCnt,
                            "reviewHit": paging[i].reviewHit
                        }
                    }
                    var list = {
                        data: review,
                        page: datas[1],
                        pageSize: pageSize,
                        startPage: startPage,
                        endPage: endPage,
                        totalPage: totalPage,
                        max: max
                    };
                    done(data, list);
                    conn.release();
                });
            });
        })
    })
};

exports.login = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.login, datas, function (err, row) {
            if (err) logger.error('err', err);
            var success = false;
            if (row[0].cnt == 1) {
                success = true;
            }
            conn.release();
            done(success)
        })
    })
}

exports.fb_login = function (datas, done) {
    pool.getConnection(function (err, conn) {
        conn.query(sql.fbLogin, datas[1], function (err, rows) {
            if (err) logger.error('err', err);
            logger.debug('rows', rows);
            var success = false;
            if (rows[0].cnt == 0) {
                conn.query(sql.fbInsert, datas, function (err, row) {
                    if (err) logger.error('err', err);
                    var success = false;
                    logger.debug('row', row);
                    if (row.affectedRows == 1) {
                        success = true;
                        var babyBirth = 'no'
                        var isBabyChecked = 0;

                    }
                    done(success, babyBirth, isBabyChecked);
                    conn.release();
                })
            } else {
                conn.query(sql.baby, datas[1], function (err, baby) {
                    if (err) logger.error('err', err);
                    logger.debug('baby', baby);
                    if (baby.length > 0) {
                        var babyBirth = baby[0].babyBirth;
                        var isBabyChecked = 1;
                    } else {
                        var babyBirth = 'no'
                        var isBabyChecked = 0;

                    }
                    success = true;

                    conn.release()
                    done(success, babyBirth, isBabyChecked)
                })
            }
        })
    })
}
exports.list = function (datas, callback) {
    var page = datas[0];
    var keyword = datas[1];
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        sql.listWithKeyword(keyword, function(sql_cnt, sql_list){
            conn.query(sql_cnt, function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
                var cnt = rows[0].cnt;
                var size = 18; //보여줄 글의 수
                var begin = (page - 1) * size; //시작 글 번호
                var totalPage = Math.ceil(cnt / size);
                var pageSize = 10; // 링크 갯수
                var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
                var endPage = startPage + (pageSize - 1); //끝 링크
                if (endPage > totalPage) {
                    endPage = totalPage;
                }
                var max = cnt - ((page - 1) * size);
                conn.query(sql_list, [begin, size], function (err, rows) {
                    if (err) logger.error('err', err);
                    logger.debug('rows', rows);
                    var review = [];
                    for (var i = 0; i < rows.length; i++) {
                        review[i] = {
                            "reviewNum": rows[i].reviewNum,
                            "productName": rows[i].productName,
                            "productBrand": rows[i].productBrand,
                            "memberName": rows[i].memberName,
                            "memberId": rows[i].memberId,
                            "reviewPicture": reviewUrl + rows[i].reviewThumbnail,
                            "likeFlagCnt": rows[i].likeFlagCnt,
                            "reviewReplyCnt": rows[i].reviewReplyCnt,
                            "reviewHit": rows[i].reviewHit
                        }
                    }
                    var list = {
                        data: review,
                        page: page,
                        pageSize: pageSize,
                        startPage: startPage,
                        endPage: endPage,
                        totalPage: totalPage,
                        max: max
                    };
                    conn.release();
                    callback(list);
                });
            });
        });
    });
};

exports.mypage = function (memberId, done){
    pool.getConnection(function(err, conn) {
            if(err) {
                callback(err);
            } else {
                conn.beginTransaction(function(err) {
                    if(err) {
                        conn.rollback(function() {
                            callback(err);
                            return;
                        });
                    }
                    async.parallel(
                        {
                            myInfo : function(done) {
                                conn.query(sql.myInform, memberId, function(err, row){
                                    if(err) callback(err);
                                    done(null, row[0]);
                                });
                            },
                            myReviews : function(done) {
                                conn.query(sql.myReviews, memberId, function (err, review) {
                                    if (err) logger.error('err', err);
                                    done(null, review);
                                });
                            }
                        }, function(err, result) {
                            if(err) {
                                conn.rollback(function() {
                                    done(err);
                                });
                            } else {
                                conn.commit(function(err){
                                    if(err) {
                                        conn.rollback(function() {
                                            done(err);
                                        });
                                    } else {
                                        logger.debug("result", result);
                                        done(result);
                                    }
                                });
                            }
                        }); //async
                    conn.release();
                });  //transaction
            }
        });
}

exports.modifyMypage = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.modifyMypage, datas, function (err, row) {
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

exports.myPicture = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err);
            return;
        }
        conn.query(sql.modifyMyPic, datas, function (err, row) {
            if (err) {
                logger.error('err', err);
                done(err);
                return;
            }
            logger.debug('row', row);
            var success = false;
            if (row.affectedRows == 1) {
                success = true;
            }
            done(null, success);
            conn.release();
        })
    })
}

exports.reviewRead = function (datas, done) {
    var reviewNum = datas[0];
    var memberId = datas[1];
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err1', err);
        conn.query(sql.updateHits, reviewNum, function (err, rows) {
            if (err) logger.error('err', err);
            if (rows.affectedRows >= 1) {
                conn.query(sql.readReview, reviewNum, function (err, rows) {
                    if (err) logger.error('err2', err);
                    conn.query(sql.getReplies, reviewNum, function (err, comment) {
                        if (err) logger.error('err3', err);
                        conn.query(sql.likeCnt, [reviewNum, memberId], function (err, lf) {
                            if (err) logger.error('err4', err);


                            var data = {
                                "memberId": rows[0].memberId,
                                "reviewNum": rows[0].reviewNum,
                                "productBrand": rows[0].productBrand,
                                "productName": rows[0].productName,
                                "reviewStar": rows[0].reviewStar,
                                "reviewPrice": rows[0].reviewPrice,
                                "reviewWhere": rows[0].reviewWhere,
                                "reviewGood": rows[0].reviewGood,
                                "reviewBad": rows[0].reviewBad,
                                "reviewKnowhow": rows[0].reviewKnowhow,
                                "reviewRecommandPeople": rows[0].reviewRecommandPeople,
                                "reviewContent": rows[0].reviewContent,
                                "isReaderLike": lf[0].isReaderLike,
                                "reviewPicture1": absolutePathConverter(reviewUrl, rows[0].reviewPicture1),
                                "reviewPicture2": absolutePathConverter(reviewUrl, rows[0].reviewPicture2),
                                "reviewPicture3": absolutePathConverter(reviewUrl, rows[0].reviewPicture3),
                                "reviewPicture4": absolutePathConverter(reviewUrl, rows[0].reviewPicture4),
                                "reviewPicture5": absolutePathConverter(reviewUrl, rows[0].reviewPicture5),
                                "likeFlagCnt": rows[0].likeFlagCnt,
                                "reviewReplyCnt": rows[0].reviewReplyCnt,
                                "reviewHit": rows[0].reviewHit,
                                "comment": comment
                            };
                            logger.debug('data', data);
                            conn.release();
                            done(data);
                        })
                    })
                })
            }
        });
    });
};

exports.delReview = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.delReview, datas, function (err, row) {
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

exports.like = function (datas, done) {
    logger.debug('datas', datas);
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.like, datas, function (err, row) {
            if (err) logger.error('err', err);
            logger.debug('row', row);
            if (row.affectedRows >= 1) {
                if (datas[2] == 1) {
                    // logger.debug('안넘오옴');
                    conn.query(sql.getReceiver, datas[1], function (err, receiver) {
                        if (err) logger.error('err', err);
                        conn.query(sql.likeGCM, [datas[0], receiver[0].memberId, datas[1]], function (err, rows) {
                            if (err) logger.error('err', err);
                            var success = false;
                            if (rows.affectedRows >= 1) {
                                success = true;
                            }
                            done(success);
                            conn.release();
                        })
                    })
                } else {
                    conn.query(sql.delLikeGCM, [datas[0], datas[1]], function (err, cancle) {
                        if (err) logger.error('err', err);
                        var success = false;
                        if (cancle.affectedRows >= 1) {
                            success = true;
                        }
                        done(success);
                        conn.release();

                    })
                }
            }
        })
    })



}


exports.reply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.reply, datas, function (err, row) {
            if (err) logger.error('err', err);
            var success = false;
            if (row.affectedRows == 1) {
                conn.query(sql.getReceiver, datas[0], function (err, receiver) {
                    if (err) logger.error('err', err);
                    conn.query(sql.replyGCM, [datas[1], receiver[0].memberId, datas[0]], function (err, rows) {
                        if (err) logger.error('err', err);
                        logger.debug('rows', rows);
                        if (rows.affectedRows == 1) {
                            success = true;
                        }
                        done(success);
                        conn.release();
                    })
                })
            } else {
                done(success);
                conn.release();
            }
        });
    });
}

exports.delReply = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.delReply, datas, function (err, row) {
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

exports.productSearch = function (productName, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        sql.productSearch(productName, function(convertedSQL){
            conn.query(convertedSQL, function (err, rows) {
                if (err) logger.error('err', err);
                //logger.info('rows', rows);
                logger.debug('rows', rows);
                conn.release();
                done(rows);
            });
        });
    })
}


exports.join = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) {
            logger.error('err', err);
            done(err, null);
        }
        conn.query(sql.fbLogin, datas[0], function (err, row) {
            if (err) {
                logger.error('err', err);
                conn.release();
                done(err, null);
            }
            if (row[0].cnt == 0) {
                conn.query(sql.join, datas, function (err, rows) {
                    if (err) {
                        logger.error('err', err);
                        conn.release();
                        done(err, null)
                    }
                    logger.debug('rows', rows);
                    var success = 0;
                    if (rows.affectedRows == 1) {
                        success = 1;
                    }
                    conn.release();
                    done(null, success)
                })
            } else {
                var success = 2;
                conn.release();
                done(null, success);
            }
        })
    })
}

exports.getProduct = function (productNum, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.getProduct, productNum, function (err, row) {
            if (err) logger.error('err', err);
            //logger.info('rows', rows);
            logger.debug('row', row);
            conn.release();
            done(row);
        });
    })
}

exports.write = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.reviewWrite, datas, function (err, row) {
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

exports.productwrite = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.productWrite, datas, function (err, row) {
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

exports.reviewSearch = function (keyword, callback) {
    var page = 1;
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        sql.listWithKeyword(keyword, function(sql_cnt, sql_list){
            conn.query(sql_cnt, function (err, rows) {
                if (err) logger.error('err', err);
                logger.debug('rows', rows); //[{cnt:1}] 의 형태로 나옴
                var cnt = rows[0].cnt;
                var size = 18; //보여줄 글의 수
                var begin = (page - 1) * size; //시작 글 번호
                var totalPage = Math.ceil(cnt / size);
                var pageSize = 10; // 링크 갯수
                var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
                var endPage = startPage + (pageSize - 1); //끝 링크
                if (endPage > totalPage) {
                    endPage = totalPage;
                }
                var max = cnt - ((page - 1) * size);
                conn.query(sql_list, [begin, size], function (err, rows) {
                    if (err) logger.error('err', err);
                    logger.debug('rows', rows);
                    var review = [];
                    for (var i = 0; i < rows.length; i++) {
                        review[i] = {
                            "reviewNum": rows[i].reviewNum,
                            "productName": rows[i].productName,
                            "productBrand": rows[i].productBrand,
                            "memberName": rows[i].memberName,
                            "memberId": rows[i].memberId,
                            "reviewPicture": reviewUrl + rows[i].reviewThumbnail,
                            "likeFlagCnt": rows[i].likeFlagCnt,
                            "reviewReplyCnt": rows[i].reviewReplyCnt,
                            "reviewHit": rows[i].reviewHit
                        }
                    }
                    var list = {
                        data: review,
                        page: page,
                        pageSize: pageSize,
                        startPage: startPage,
                        endPage: endPage,
                        totalPage: totalPage,
                        max: max
                    };
                    conn.release();
                    callback(list);
                });
            });
        });
    });
};

exports.getReview = function (reviewNum, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.getReview, reviewNum, function (err, row) {
            if (err) logger.error('err', err);
            //logger.info('rows', rows);
            logger.debug('row', row);
            conn.release();
            done(row);
        });
    })
}

exports.modifyReview = function (datas, done) {
    pool.getConnection(function (err, conn) {
        if (err) logger.error('err', err);
        conn.query(sql.modifyReview, datas, function (err, row) {
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

exports.popup = function(done){
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
                    "imageUrl" :  row[0].eventPicture
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



function absolutePathConverter(url, picture){
    if(picture == null){
        picture = null;
    }else if (picture == '\r'){
        picture = null;
    }else if (picture == ''){
        picture = null;
    }else{
        picture = url + picture;
    }

    return picture;
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