var express = require('express');
var router = express.Router();
var db_web = require('../models/db_web');
var gcm = require('../etc/gcm');
var async = require('async');
var logger = require('../etc/logger');
var crypto = require('../etc/crypto');
var picture = require('../etc/picture');
var facebook = require('../etc/facebook');

router.get('/login', function (req, res) {
    res.render('web/login')
})


router.post('/login', function (req, res) {
    var memberId = req.body.memberId;
    var inputpass = req.body.memberPasswd;
    crypto.myCrypto(inputpass, function (err, cryptoPass) {
        if (err) {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
        } else {
            var memberPasswd = cryptoPass;
            var datas = [memberId, memberPasswd];
            db_web.login(datas, function (success) {
                if (success) {
                    req.session.user_id = memberId;
                    res.send('<head><meta charset="utf-8"><script>alert("로그인 되었습니다!!");location.href="/web"</script></head>');
                } else {
                    res.send('<head><meta charset="utf-8"><script>alert("비밀번호가 잘못되었거나 없는 아이디입니다!!");history.back();</script></head>');
                }
            });
        }
    });
});

router.get('/fb_login', function (req, res) {
    var code = req.query.code;
    var error = req.query.error;
    var gender = 0;
    var memberOption = 0;

    if (!code) {
        facebook.getUrl(function (authUrl) {
            logger.debug('authUrl', authUrl)

            if (!error) { //checks whether a user denied the app facebook login/permissions
                res.redirect(authUrl);
            } else {  //req.query.error == 'access_denied'
                res.send('access denied');
            }
            return;
        })
    } else {
        facebook.fb_login(code, function (err, data, token) {
            if (err) {
                console.error('err', err);
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
            } else {
                var memberId = data.id;
                if (data.gender == 'male') {
                    gender = 1;
                    memberOption = 1;
                } else {
                    gender = 2;
                    memberOption = 2;
                }
                var memberName = data.name;
                var memberEmail = data.email;
                var datas = [token, memberId, gender, memberName, memberOption, memberEmail];
                db_web.fb_login(datas, function (success) {
                    if (success) {
                        req.session.user_id = memberId;
                        res.redirect('/web');
                    } else {
                        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
                    }
                });
            }
        });
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    var memberId = req.session.user_id;
    var page = 1;
    var keyword = '';
    if (memberId) {
        var datas = [memberId, page];
        db_web.index(datas, function (data, list) {
            if (data) {
                req.session.myInform = data[0];
                res.render('web/index', {
                    "memberId": memberId,
                    "keyword": keyword,
                    "list": list,
                    "myInform": req.session.myInform
                });
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
                'history.back();</script></head>');
            }
        });
    } else {
        var datas = [page * 1, keyword];
        db_web.list(datas, function (list) {
            if (list) {
                //res.json({"data":data, "list":list});
                res.render('web/index', {
                    "memberId": memberId,
                    "keyword": keyword,
                    "list": list,
                    "myInform": req.session.myInform
                });
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
                'history.back();</script></head>');
            }
        })
    }
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) logger.error('err', err);
        res.end('<head><meta charset="utf-8"><script>alert("로그아웃 되었습니다!!");location.href="/web";</script></head>');
        //res.redirect('/members/main');
    });
});

router.get('/join', function (req, res) {
    res.render('web/join')
})


router.get('/join', function (req, res) {
    res.render('web/join')
})

router.post('/join', function (req, res) {
    var memberId = req.body.memberId;
    var inputpass = req.body.memberPasswd;
    var memberName = req.body.memberName;
    var memberBirth = req.body.memberBirth;
    var memberOption = req.body.memberOption;
    if (memberOption == 1 || memberOption == 3) {
        var memberGender = 1;
    } else {
        var memberGender = 2;
    }
    if (!memberId) {
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!inputpass) {
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!memberName) {
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!memberBirth) {
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!memberOption) {
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else {
        crypto.myCrypto(inputpass, function (err, cryptoPass) {
            if (err) {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
            } else {
                var memberPasswd = cryptoPass;
                var datas = [memberId, memberPasswd, memberName, memberBirth, memberOption, memberGender];
                db_web.join(datas, function (err, success) {
                    if (err) {
                        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
                    } else {
                        if (success == 1) {
                            res.send('<head><meta charset="utf-8"><script>alert("회원 가입 되었습니다!!");location.href="/web";</script></head>');
                        } else if (success == 2) {
                            res.send('<head><meta charset="utf-8"><script>alert("중복된 아이디가 있습니다!!");history.back();</script></head>');
                        } else {
                            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
                        }
                    }
                })
            }
        })
    }
})

router.get('/mypage', function (req, res, next) {
    var memberId = req.session.user_id;
    var keyword = "";
    if (!memberId) {
        res.json({"success": 0, "result": {"message": " 아이디 없음, 마이 페이지 실패"}});
    } else {
        db_web.mypage(memberId, function (result) {
            if (result) {
                // console.log('result', result);
                // res.json({title:"test", result:result});
                res.render('web/mypage', {
                    title: 'Soodaa',
                    keyword: keyword,
                    memberId: memberId,
                    data: result,
                    "myInform": req.session.myInform
                });
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
                'history.back();</script></head>');
            }
        });
    }
});

router.post('/mypage', function (req, res, next) {
    var memberId = req.session.user_id;
    var memberName = req.body.memberName;
    var memberBirth = req.body.memberBirth;
    var memberGender = req.body.memberGender;

    if (!memberId) {
        // res.json({"success": 0, "result": {"message": "제품 번호 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("0에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!memberName) {
        // res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("?9에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!memberBirth) {
        // res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("9에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!memberGender) {
        // res.json({"success": 0, "result": {"message": "리뷰 내용 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("8에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else {
        var datas = [memberName, memberBirth, memberGender, memberId];
        db_web.modifyMypage(datas, function (success) {
            if (success == true) {
                // res.json({"success": 1, "result": {"message": "마이페이지 수정을 완료하였습니다"}});
                res.redirect('/web/mypage');
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
            }
        });
    }
})

router.post('/myPicture', function (req, res, next) {
    var memberId = req.session.user_id;
    var memberPicture = req.files.memberPicture;

    if (!memberId) {
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else {
        memberPicture = 'member_' + memberPicture.name;
        var datas = [memberPicture, memberId];
    }
    async.waterfall([
        function (callback) {
            picture.member(req.files.memberPicture.name, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            })
        },
        function (callback) {
            db_web.myPicture(datas, function (err, success) {
                if (err) {
                    callback(err);
                } else {
                    if (success) {
                        callback(null)
                    } else {
                        callback('err');
                    }
                }
            });
        }
    ], function (err) {
        if (err) {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
        } else {
            res.redirect('/web/mypage');
        }
    })

});

router.get('/memberPage/:userId', function (req, res, next) {
    var userId = req.params.userId;
    var memberId = req.session.user_id;
    var keyword = "";
    if (!userId) {
        res.json({"success": 0, "result": {"message": " 아이디 없음, 사용자 페이지 실패"}});
    } else {
        db_web.mypage(userId, function (result) {
            if (result) {
                res.render('web/memberPage', {
                    title: 'Soodaa',
                    memberId: memberId,
                    data: result,
                    "myInform": req.session.myInform,
                    keyword: keyword
                });
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
                'history.back();</script></head>');
            }
        });
    }
});

router.get('/view/:reviewNum', function (req, res) {
    var reviewNum = req.params.reviewNum;
    // console.log('reviewNum', reviewNum);
    var memberId = req.session.user_id;
    var datas = [reviewNum * 1, memberId];
    var keyword = "";
    var temp = "";
    db_web.reviewRead(datas, function (data) {
        // res.json({result:data});
        // http://stackoverflow.com/questions/2390038/replace-n-with-br-and-r-n-with-p-in-javascript 참조함
        if (data) {
            temp = data.reviewContent;
            temp = temp.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
            data.reviewContent = temp;
            // res.json({title:"오늘의 육아 읽기", data:data});
            res.render('web/view', {
                title: "리뷰 읽기",
                data: data,
                keyword: keyword,
                memberId: memberId,
                "myInform": req.session.myInform
            });
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

router.post('/delReview', function (req, res) {
    var reviewNum = req.body.reviewNum;
    var memberId = req.session.user_id;
    if (!reviewNum) {
        // res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 삭제 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!memberId) {
        // res.json({"success": 0, "result": {"message": "아이디 없음, 리뷰 삭제 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else {
        var datas = [reviewNum * 1, memberId];
        db_web.delReview(datas, function (success) {
            if (success) {
                // res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
                res.redirect('/web/');
            } else {
                // res.json({"success": 0, "result": {"message": "리뷰 삭제 실패"}});
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');

            }
        })
    }
});

router.post('/like/', function (req, res, next) {
    var memberId = req.session.user_id;
    var reviewNum = req.body.reviewNum;
    var like_flag = req.body.isReaderLike;
    if (!reviewNum) {
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
        'history.back();</script></head>')
    } else if (!memberId) {
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
        'history.back();</script></head>')
    } else {
        var datas = [memberId, reviewNum * 1, like_flag, like_flag];
        db_web.like(datas, function (success) {
            if (success) {
                gcm.reviewLike(reviewNum * 1, function (done) {
                    logger.debug('done', done);
                    res.redirect('/web/view/' + reviewNum);
                });
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
            }
        })
    }
});

router.get('/list', function (req, res) {
    var memberId = req.session.user_id;
    var page = req.query.page;
    var keyword = req.query.keyword;
    if (!page) {
        return;
    } else {
        var datas = [page * 1, keyword];
        db_web.list(datas, function (list) {
            res.render('web/list', {"list": list});
        })
    }
})
router.post('/reply', function (req, res) {
    var memberId = req.session.user_id;
    var reviewNum = req.body.reviewNum;
    var reviewReplyContent = req.body.reviewReplyContent;
    if (!memberId) {
        // res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 댓글 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!reviewNum) {
        // res.json({"success": 0, "result": {"message": "리뷰 번호 없음, 리뷰 댓글 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!reviewReplyContent) {
        // res.json({"success": 0, "result": {"message": "댓글 내용 없음, 리뷰 댓글 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else {
        var datas = [reviewNum * 1, memberId, reviewReplyContent];
        db_web.reply(datas, function (success, result) {
            if (success) {
                gcm.reviewReply(reviewNum * 1, function (done) {
                    res.redirect('/web/view/' + reviewNum);
                });
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
            }
        });
    }
});

router.post('/delReply', function (req, res, next) {
    var reviewReplyNum = req.body.reviewReplyNum;
    var memberId = req.session.user_id;
    if (!reviewReplyNum) {
        // res.json({"success": 0, "result": {"message": "댓글 번호 없음, 리뷰 댓글 삭제 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!memberId) {
        // res.json({"success": 0, "result": {"message": "아이디 없음, 리뷰 댓글 삭제 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else {
        var datas = [reviewReplyNum * 1, memberId];
        db_web.delReply(datas, function (success) {
            if (success) {
                res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
            } else {
                // res.json({"success": 0, "result": {"message": "리뷰 댓글 삭제 실패"}});
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
            }
        })
    }
});

router.get('/write_first', function (req, res) {
    var memberId = req.session.user_id;
    var data = "";
    var keyword = "";
    res.render('web/write_first', {
        data: data,
        memberId: memberId,
        keyword: keyword,
        "myInform": req.session.myInform
    });
});

router.get('/write_first/:productName', function (req, res) {
    var memberId = req.session.user_id;
    var productName = req.params.productName;
    var keyword = "";
    db_web.productSearch(productName, function (data) {
        // res.json({result:data});
        if (data) {
            res.render('web/write_first', {
                data: data,
                memberId: memberId, "myInform": req.session.myInform, keyword: keyword
            });
            //res.json({title:"오늘의 육아 읽기", data:data, page:page});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
        }
    })
});


router.get('/write/:productNum', function (req, res) {
    //res.json({'aaa':"aaa"})
    var memberId = req.session.user_id;
    var productNum = req.params.productNum;
    var keyword = "";
    db_web.getProduct(productNum, function (data) {
        // res.json({result:data});
        if (data) {
            res.render('web/write', {
                data: data,
                memberId: memberId, "myInform": req.session.myInform, keyword: keyword
            });
            //res.json({title:"오늘의 육아 읽기", data:data, page:page});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
        }
    })

})

router.post('/write', function (req, res) {
    var memberId = req.session.user_id;
    var productNum = req.body.productNum;
    var reviewContent = req.body.reviewContent;
    var reviewWhere = req.body.reviewWhere;
    var reviewPrice = req.body.reviewPrice;
    var reviewKnowhow = req.body.reviewKnowhow;
    var reviewGood = req.body.reviewGood;
    var reviewBad = req.body.reviewBad;
    var reviewRecommendPeople = req.body.reviewRecommandPeople;
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
        // res.json({"success": 0, "result": {"message": "제품 번호 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("0에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!memberId) {
        // res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("9에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewContent) {
        // res.json({"success": 0, "result": {"message": "리뷰 내용 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("8에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewWhere) {
        // res.json({"success": 0, "result": {"message": "구매 장소 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("7에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewPrice) {
        // res.json({"success": 0, "result": {"message": "가격 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("6에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewGood) {
        // res.json({"success": 0, "result": {"message": "장점 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("5에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewBad) {
        // res.json({"success": 0, "result": {"message": "단점 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("4에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewRecommendPeople) {
        // res.json({"success": 0, "result": {"message": "추천 사람 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("3에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewStar) {
        // res.json({"success": 0, "result": {"message": "별점 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("2에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewPicture1) {
        // res.json({"success": 0, "result": {"message": "사진 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("1에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else {
        async.waterfall([
            function (callback) {
                picture.review(req.files.reviewPicture1, files, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                })
            },
            function (callback) {
                var datas = [productNum * 1, memberId, reviewContent, reviewWhere, reviewPrice, reviewKnowhow, reviewGood,
                    reviewBad, reviewRecommendPeople, reviewStar, reviewThumbnail, reviewPicture1,
                    reviewPicture2, reviewPicture3, reviewPicture4, reviewPicture5];

                db_web.write(datas, function (success) {
                    if (success == true) {
                        callback(null)
                    } else {
                        callback('err');
                    }
                });
            }

        ], function (err) {
            if (err) {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
            } else {
                res.redirect('/web/');
            }
        })
    }
});

router.get('/new_product', function (req, res) {
    var memberId = req.session.user_id;
    var data = "";
    var keyword = "";
    res.render('web/new_product', {
        data: data,
        memberId: memberId,
        "myInform": req.session.myInform,
        keyword: keyword
    });
});

router.post('/new_product', function (req, res) {
    var productCategory1 = req.body.productCategory1;
    var productBrand = req.body.productBrand;
    var productName = req.body.productName;

    if (!productCategory1) {
        // res.json({"success": 0, "result": {"message": "카테고리1 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!productBrand) {
        // res.json({"success": 0, "result": {"message": "브랜드 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else if (!productName) {
        // res.json({"success": 0, "result": {"message": "리뷰 내용 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
    } else {
        var datas = [productCategory1, productBrand, productName];
        db_web.productwrite(datas, function (success) {
            if (success == true) {
                // res.json({"success": 1, "result": {"message": "제품 등록을 완료하였습니다"}});
                res.redirect('/web/write_first');
            } else {
                // res.json({"success": 0, "result": {"message": "제품 등록에 문제가 발생하였습니다."}});
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
            }
        });
    }
});

router.get('/search=:keyword*', function (req, res) {
    var memberId = req.session.user_id;
    var keyword = req.params.keyword;
    var page = req.query.page;

    db_web.reviewSearch(keyword, function (list) {
        // res.json({result:data});
        if (list) {
            res.render('web/index', {
                "title": 'Soodaa',
                "keyword": keyword,
                "memberId": memberId,
                "list": list,
                "myInform": req.session.myInform
            });
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
        }
    })
});

router.get('/modify/:reviewNum', function (req, res) {
    //res.json({'aaa':"aaa"})
    var memberId = req.session.user_id;
    var reviewNum = req.params.reviewNum;
    var keyword = "";
    db_web.getReview(reviewNum, function (data) {
        // res.json({result:data});
        if (data) {
            if (data[0].memberId != memberId) {
                res.send('<head><meta charset="utf-8"><script>alert("글을 수정할 권한이 없습니다.");history.back();</script></head>')
            } else {
                res.render('web/modify', {
                    data: data,
                    memberId: memberId, "myInform": req.session.myInform, keyword: keyword
                });
            }
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
        }
    })
})

router.post('/modify', function (req, res) {
    var memberId = req.session.user_id;
    var reviewNum = req.body.reviewNum;
    var productNum = req.body.productNum;
    var reviewContent = req.body.reviewContent;
    var reviewWhere = req.body.reviewWhere;
    var reviewPrice = req.body.reviewPrice;
    var reviewKnowhow = req.body.reviewKnowhow;
    var reviewGood = req.body.reviewGood;
    var reviewBad = req.body.reviewBad;
    var reviewRecommendPeople = req.body.reviewRecommandPeople;
    var reviewStar = req.body.reviewStar;

    if (!productNum) {
        // res.json({"success": 0, "result": {"message": "제품 번호 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("0에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewNum) {
        // res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("?9에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!memberId) {
        // res.json({"success": 0, "result": {"message": "세션 아이디 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("9에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewContent) {
        // res.json({"success": 0, "result": {"message": "리뷰 내용 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("8에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewWhere) {
        // res.json({"success": 0, "result": {"message": "구매 장소 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("7에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewPrice) {
        // res.json({"success": 0, "result": {"message": "가격 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("6에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewGood) {
        // res.json({"success": 0, "result": {"message": "장점 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("5에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewBad) {
        // res.json({"success": 0, "result": {"message": "단점 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("4에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewRecommendPeople) {
        // res.json({"success": 0, "result": {"message": "추천 사람 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("3에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewKnowhow) {
        // res.json({"success": 0, "result": {"message": "추천 사람 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("3에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else if (!reviewStar) {
        // res.json({"success": 0, "result": {"message": "별점 없음, 리뷰 쓰기 실패"}});
        res.send('<head><meta charset="utf-8"><script>alert("2에러가 발생하여 되돌아갑니다!!");history.back();</script></head>')
    } else {
        var datas = [productNum * 1, reviewContent, reviewWhere, reviewPrice, reviewGood, reviewBad, reviewRecommendPeople, reviewKnowhow, reviewStar, memberId, reviewNum * 1];
        db_web.modifyReview(datas, function (success) {
            if (success == true) {
                // res.json({"success": 1, "result": {"message": "리뷰 수정을 완료하였습니다"}});
                res.redirect('/web/view/' + reviewNum);
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("1212에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
            }
        });
    }
});

router.get('/popup', function (req, res) {

    db_web.popup(function (err, data) {
        if (err) {
            res.send('<head><meta charset="utf-8"><script>alert("1212에러가 발생하여 되돌아갑니다!!");history.back();</script></head>');
        } else {
            //res.json({ "result": data});
            res.render('web/popup', {"result": data});

        }
    })
})

module.exports = router;