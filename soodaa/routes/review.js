var express = require('express');
var router = express.Router();
var db_review = require('../models/db_review');
var picture = require('../etc/picture');
var gcm = require('../etc/gcm');
var logger = require('../etc/logger');
var async = require('async');

router.post('/write', function (req, res, next) {
    var memberId = req.session.user_id;
    var inputProduct = req.body.inputProduct;
    var productNum = req.body.productNum;
    var reviewContent = req.body.reviewContent;
    var reviewWhere = req.body.reviewWhere;
    var reviewPrice = req.body.reviewPrice;
    var reviewKnowhow = req.body.reviewKnowhow;
    var reviewGood = req.body.reviewGood;
    var reviewBad = req.body.reviewBad;
    var reviewRecommendPeople = req.body.reviewRecommendPeople;
    var reviewStar = req.body.reviewStar;
    var reviewPicture1 = 'review_' + req.files.reviewPicture1.name;
    var files = [req.files.reviewPicture1.name];
    var idx = reviewPicture1.lastIndexOf('.');
    var prefixName = reviewPicture1.substring(0, idx);
    var extension = req.files.reviewPicture1.extension;
    var reviewThumbnail = prefixName + '-thumbnail.' + extension;
    if (req.files.reviewPicture2) {
        var reviewPicture2 = 'review_' + req.files.reviewPicture2.name;
        files.push(req.files.reviewPicture2.name);
    }
    if (req.files.reviewPicture3) {
        var reviewPicture3 = 'review_' + req.files.reviewPicture3.name;
        files.push(req.files.reviewPicture3.name);
    }
    if (req.files.reviewPicture4) {
        var reviewPicture4 = 'review_' + req.files.reviewPicture4.name;
        files.push(req.files.reviewPicture4.name);
    }
    if (req.files.reviewPicture5) {
        var reviewPicture5 = 'review_' + req.files.reviewPicture5.name;
        files.push(req.files.reviewPicture5.name);
    }
    if (!productNum) {
        res.json({"success": 0, "result": {"message": "제품 번호 없음, 리뷰 쓰기 실패"}});
    } else if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 쓰기 실패"}});
    } else if (!reviewContent) {
        res.json({"success": 0, "result": {"message": "리뷰 내용 없음, 리뷰 쓰기 실패"}});
    } else if (!reviewWhere) {
        res.json({"success": 0, "result": {"message": "구매 장소 없음, 리뷰 쓰기 실패"}});
    } else if (!reviewPrice) {
        res.json({"success": 0, "result": {"message": "가격 없음, 리뷰 쓰기 실패"}});
    } else if (!reviewGood) {
        res.json({"success": 0, "result": {"message": "장점 없음, 리뷰 쓰기 실패"}});
    } else if (!reviewBad) {
        res.json({"success": 0, "result": {"message": "단점 없음, 리뷰 쓰기 실패"}});
    } else if (!reviewStar) {
        res.json({"success": 0, "result": {"message": "별점 없음, 리뷰 쓰기 실패"}});
    } else if (!reviewPicture1) {
        res.json({"success": 0, "result": {"message": "사진 없음, 리뷰 쓰기 실패"}});
    } else {
        async.waterfall([
            function(callback){
                picture.review(req.files.reviewPicture1, files, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null);
                    }
                })
            },
            function(callback){
                var datas = [productNum * 1, inputProduct, memberId, reviewContent, reviewWhere, reviewPrice, reviewKnowhow, reviewGood,
                    reviewBad, reviewRecommendPeople, reviewStar, reviewThumbnail, reviewPicture1,
                    reviewPicture2, reviewPicture3, reviewPicture4, reviewPicture5];
                if (datas[0] == -1) {
                    db_review.write2(datas, function (err, success) {
                        if(err){
                            callback(err);
                        } else {
                            if(success){
                                callback(null);
                            } else {
                                callback('err');
                            }
                        }
                    });
                } else {
                    datas.splice(1, 1);
                    db_review.write(datas, function (err) {
                        if(err){
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                }
            }
        ], function(err){
            if(err){
                res.json({"success": 0, "result": {"message": "리뷰 작성에 문제가 발생하였습니다."}});
            } else {
                res.json({"success": 1, "result": {"message": "리뷰 작성을 완료하였습니다"}});
            }
        })

    }
});

//리스트
router.get('/list', function (req, res, next) {
    var start = req.query.start;
    var count = req.query.count;
    var arrange = req.query.arrange;
    if(req.session.babyBirth){
        var babyBirth = req.session.babyBirth;
    } else {
        var babyBirth = 'no2'
    }
    if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 리뷰 리스트 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 리뷰 리스트 실패"}});
    } else if (!arrange) {
        res.json({"success": 0, "result": {"message": "카테고리 없음, 리뷰 리스트 실패"}});
    } else {
        var datas = [start * 1, count * 1, arrange * 1, babyBirth];
        logger.debug('datas', datas);
        db_review.list(datas, function (err, message, data, cnt) {
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if (data) {
                    res.json({"success": 1, "result": {"message": message, "data": data, "totalCnt":cnt}});
                } else {
                    res.json({"success": 0, "result": {"message": "리뷰 리스트 실패"}});
                }
            }
        });
    }
});


router.get('/search', function (req, res, next) {
    var start = req.query.start;
    var count = req.query.count;
    var arrange = req.query.arrange;
    var keyword = req.query.keyword;

    if (!keyword) {
        res.json({"success": 0, "result": {"message": "검색어 없음, 검색 실패"}});
    } else if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 검색 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 검색 실패"}});
    } else if (!arrange) {
        res.json({"success": 0, "result": {"message": "카테고리 없음, 검색 실패"}});
    } else {
        var datas = [start * 1, count * 1, arrange * 1, keyword];
        db_review.regsearch(keyword, function (err, message, success) {
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if(success) {
                    db_review.list(datas, function (err, message, data, cnt) {
                        if(err) {
                            res.json({"success": 0, "result": {"message": message}});
                        } else {
                            if (data) {
                                res.json({"success": 1, "result": {"message": message, "data": data, "totalCnt":cnt}});
                            } else {
                                res.json({"success": 0, "result": {"message": "검색 실패"}});
                            }
                        }
                    });
                } else {
                    res.json({"success": 0, "result": {"message": message}});

                }
            }
        });
    }
});


//리뷰상세보기
router.get('/read', function (req, res, next) {
    var memberId = req.session.user_id;
    var reviewNum = req.query.reviewNum;

    if (!reviewNum) {
        res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 상세보기 실패"}});
    } else {
        var datas = [reviewNum * 1, memberId];
        logger.debug('datas', datas);
        db_review.read(datas, function (err, data) {
            if (err) {
                res.json({"success": 0, "result": {"message":"error"}});
            } else {
                if (data) {
                    res.json({"success": 1, "result": {"message": "리뷰 보기 성공", "data": data}});
                } else {
                    res.json({"success": 0, "result": {"message": "리뷰 보기 실패"}});
                }
            }
        })
    }
});


router.post('/modify', function (req, res, next) {
    var memberId = req.session.user_id;
    var reviewNum = req.body.reviewNum;
    var reviewContent = req.body.reviewContent;
    var reviewWhere = req.body.reviewWhere;
    var reviewPrice = req.body.reviewPrice;
    var reviewKnowhow = req.body.reviewKnowhow;
    var reviewGood = req.body.reviewGood;
    var reviewBad = req.body.reviewBad;
    var reviewRecommendPeople = req.body.reviewRecommendPeople;
    var reviewStar = req.body.reviewStar;

    if (!reviewNum) {
        res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 수정 실패"}});
    } else if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 수정 실패"}});
    } else if (!reviewContent) {
        res.json({"success": 0, "result": {"message": "리뷰 내용 없음, 리뷰 수정 실패"}});
    } else if (!reviewWhere) {
        res.json({"success": 0, "result": {"message": "구매 장소 없음, 리뷰 수정 실패"}});
    } else if (!reviewPrice) {
        res.json({"success": 0, "result": {"message": "가격 없음, 리뷰 수정 실패"}});
    } else if (!reviewGood) {
        res.json({"success": 0, "result": {"message": "장점 없음, 리뷰 수정 실패"}});
    } else if (!reviewBad) {
        res.json({"success": 0, "result": {"message": "단점 없음, 리뷰 수정 실패"}});
    } else if (!reviewStar) {
        res.json({"success": 0, "result": {"message": "별점 없음, 리뷰 수정 실패"}});
    } else {
        var datas = [reviewContent, reviewWhere, reviewPrice * 1, reviewKnowhow, reviewGood,
            reviewBad, reviewRecommendPeople, reviewStar * 1, reviewNum * 1, memberId];
        logger.debug('datas', datas);
        db_review.modify(datas, function (err, message, success) {
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if (success == 1) {
                    res.json({"success": 1, "result": {"message": "리뷰 수정 성공"}});
                } else if (success == 2) {
                    res.json({"success": 0, "result": {"message": "내 글 아님, 리뷰 수정 실패"}});
                } else {
                    res.json({"success": 0, "result": {"message": "리뷰 수정 실패"}});
                }
            }
        })
    }
});

//리뷰삭제
router.post('/delete', function (req, res, next) {
    var reviewNum = req.body.reviewNum;
    var memberId = req.session.user_id;
    if (!reviewNum) {
        res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 삭제 실패"}});
    } else if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 리뷰 삭제 실패"}});
    } else {
        var datas = [reviewNum * 1, memberId];
        db_review.delete(datas, function (err) {
            if(err) {
                res.json({"success": 0, "result": {"message": "실패"}});
            } else {
                res.json({"success": 1, "result": {"message": "성공"}});
            }
        })
    }
});


//리뷰댓글리스트
router.get('/replyList', function (req, res) {
    var reviewNum = req.query.reviewNum;
    var start = req.query.start;
    var count = req.query.count;
    if (!reviewNum) {
        res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 댓글 리스트 실패"}});
    } else if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 리뷰 댓글 리스트 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 리뷰 댓글 리스트 실패"}});
    } else {
        var datas = [start * 1, count * 1, reviewNum * 1];
        db_review.replyList(datas, function (err, message, data, cnt) {
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                res.json({
                    "success": 1,
                    "result": {"message": message, "reviewReplyList": data, "totalCnt" : cnt}
                });
            }
        })
    }
})

//리뷰댓글달기
router.post('/reply', function (req, res) {
    var memberId = req.session.user_id;
    var reviewNum = req.body.reviewNum;
    var reviewReplyContent = req.body.reviewReplyContent;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 댓글 실패"}});
    } else if (!reviewNum) {
        res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 댓글 실패"}});
    } else if (!reviewReplyContent) {
        res.json({"success": 0, "result": {"message": "댓글 내용 없음, 리뷰 댓글 실패"}});
    } else {
        var datas = [reviewNum * 1, memberId, reviewReplyContent];
        db_review.reply(datas, function (err) {
            if(err) {
                res.json({"success": 0, "result": {"message": "리뷰 댓글 실패"}});

            } else {
                gcm.reviewReply(reviewNum*1, function() {
                    res.json({"success": 1, "result": {"message": "리뷰 댓글 성공"}});
                })
            }
        })
    }
})

//댓글 삭제
router.post('/delReply', function (req, res, next) {
    var reviewReplyNum = req.body.reviewReplyNum;
    var memberId = req.session.user_id;
    if (!reviewReplyNum) {
        res.json({"success": 0, "result": {"message": "댓글 번호 없음, 리뷰 댓글 삭제 실패"}});

    } else if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 리뷰 댓글 삭제 실패"}});

    } else {
        var datas = [reviewReplyNum * 1, memberId];
        db_review.delReply(datas, function (err) {
            if(err) {
                res.json({"success": 0, "result": {"message": "리뷰 댓글 삭제 실패"}});
            } else {
                res.json({"success": 1, "result": {"message": "리뷰 댓글 삭제 성공"}});
            }
        })
    }

});

//리뷰 좋아요
router.post('/reviewLike', function (req, res, next) {
    var reviewNum = req.body.reviewNum;
    var memberId = req.session.user_id;
    var like_flag = req.body.isReaderLike;
    if (!reviewNum) {
        res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 좋아요 실패"}});
    } else if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 리뷰 좋아요 실패"}});
    } else {
        var datas = [reviewNum * 1, memberId,  like_flag, like_flag];
        if(like_flag==1){
            db_review.like1(datas, function(err) {
                if(err) {
                    res.json({"success": 0, "result": {"message": "리뷰 좋아요 실패"}});

                } else {
                    gcm.reviewLike(reviewNum*1, function() {
                        res.json({"success": 1, "result": {"message": "리뷰 좋아요 성공"}});

                    })
                }
            })
        } else {
            db_review.like2(datas, function(err) {
                if(err) {
                    res.json({"success": 0, "result": {"message": "리뷰 좋아요 실패"}});

                } else {
                    res.json({"success": 1, "result": {"message": "리뷰 좋아요 성공"}});

                }
            })
        }
    }
});


//리뷰 찜
router.post('/reviewZzim', function (req, res, next) {
    var reviewNum = req.body.reviewNum;
    var memberId = req.session.user_id;
    var zzimflag = req.body.isReaderZzim;
    if (!reviewNum) {
        res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 찜 실패"}});
    } else if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 리뷰 찜 실패"}});
    } else {
        var datas = [memberId, reviewNum * 1, zzimflag, zzimflag];
        db_review.zzim1(datas, function(err) {
            if(err) {
                res.json({"success": 0, "result": {"message": "리뷰 찜 실패"}});
            } else {
                res.json({"success": 1, "result": {"message": "리뷰 찜 성공"}});
            }
        })
    }
});

//리뷰 신고
router.post('/reviewReport', function (req, res, next) {
    var reviewNum = req.body.reviewNum;
    var memberId = req.session.user_id;
    var reportContent = req.body.reportContent;
    if (!reviewNum) {
        res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 신고 실패"}});
    } else if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 리뷰 신고 실패"}});
    } else {
        var datas = [memberId, reviewNum * 1, reportContent];
        db_review.report(datas, function (success) {
            if (success) {
                res.json({"success": 1, "result": {"message": "리뷰 신고 성공"}});
            } else {
                res.json({"success": 0, "result": {"message": "리뷰 신고 실패"}});
            }
        })
    }
});

router.get('/popularQuery', function (req, res){
    db_review.popularQuery(function (err, rows){
        if (err) logger.debug('err', err);
        if (rows){
            res.json({"success": 1, "result": {"message": "검색어 불러오기 성공", "keywordList": rows}});
        }else{
            res.json({"success": 0, "result": {"message": "검색어 불러오기 실패"}});
        }
    })
})


router.get('/productSearch', function(req, res) {
    var keyword = req.query.keyword;
    db_review.productSearch(keyword,function(err, data){
        if(err) {
            res.json({"success": 0, "result": {"message": err}});
        } else {
            res.json({"success": 1, "result": {"message": "제품 목록 성공", "data": data}});
        }
    })
})

router.get('/productNum', function(req, res) {
    var productName = req.query.productName;
    db_review.productName(productName, function(err, data) {
        if(err) {
            res.json({"success": 0, "result": {"message": err}});
        } else {
            res.json({"success": 1, "result": {"message": "제품 목록 성공", "productNum": data}});
        }
    })
})


module.exports = router;
