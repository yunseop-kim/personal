// admin.js
var express = require('express');
var router = express.Router();
var db_admin = require('../models/db_admin');
var picture = require('../etc/picture');
var fs = require('fs');
var async = require('async');
var logger = require('../etc/logger');
var crypto = require('../etc/crypto');

/* GET home page. */
router.get('/', function (req, res, next) {
    logger.debug('session', req.session.user_id);
    res.render('admin', {title: 'ADMIN', memberId: req.session.user_id});
});

// 로그인
router.get('/login', function (req, res, next) {
    res.render('admin/login', {title: 'Login'});
});
// 로그인
router.post('/login', function (req, res, next) {
    var memberId = req.body.id;
    var inputpass = req.body.passwd;
    crypto.myCrypto(inputpass, function (err, crytoPass) {
        var memberPasswd = crytoPass;
        var datas = [memberId, memberPasswd];
        logger.debug('datas', datas);
        db_admin.login(datas, function (success) {
            if (success) {
                req.session.user_id = 'admin';
                res.redirect('/admin');
            }
        });
    })
});

// 로그아웃
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) logger.error('err', err);
        res.end('<head><meta charset="utf-8"><script>alert("로그아웃 되었습니다!!");location.href="/admin";</script></head>');
        //res.redirect('/members/main');
    });
});

////////////////////////////////////////////////////////////////오늘의 육아
//오늘의 육아
router.get('/todays', function (req, res) {
    res.redirect('/admin/todays/1');

})
//오늘의 육아 리스트
router.get('/todays/:page', function (req, res) {
    var page = req.params.page;
    var memberId = req.session.user_id;
    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈
    logger.debug('page', page);
    db_admin.todaysList(page, function (datas) {
        if (datas) {
            res.render('admin/todays', {title: 'Todays', memberId: memberId, datas: datas});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });
});

//오늘의 육아 쓰기 폼
router.get('/todaysWrite', function (req, res) {
    //res.json({'aaa':"aaa"})
    var memberId = req.session.user_id;

    res.render('admin/todays/writeform', {title: '오늘의 육아 쓰기', memberId: memberId});

})
//오늘의 육아 쓰기
router.post('/todaysWrite', function (req, res) {
    var memberId = req.session.user_id;
    var todaysCareTitle = req.body.todaysCareTitle;
    var todaysCareContent = req.body.todaysCareContent;
    var todaysCarePicture1 = 'todays_' + req.files.todaysCarePicture1.name;
    var files = [req.files.todaysCarePicture1.name];
    var idx = todaysCarePicture1.lastIndexOf('.');
    var prefixName = todaysCarePicture1.substring(0, idx);
    var extension = req.files.todaysCarePicture1.extension;
    var todaysCareThumbnail = prefixName + '-thumbnail.' + extension;
    if (req.files.todaysCarePicture2) {
        var todaysCarePicture2 = 'todays_' + req.files.todaysCarePicture2.name;
        files.push(req.files.todaysCarePicture2.name);
    }
    if (req.files.todaysCarePicture3) {
        var todaysCarePicture3 = 'todays_' + req.files.todaysCarePicture3.name;
        files.push(req.files.todaysCarePicture3.name);
    }
    if (req.files.todaysCarePicture4) {
        var todaysCarePicture4 = 'todays_' + req.files.todaysCarePicture4.name;
        files.push(req.files.todaysCarePicture4.name);
    }
    if (req.files.todaysCarePicture5) {
        var todaysCarePicture5 = 'todays_' + req.files.todaysCarePicture5.name;
        files.push(req.files.todaysCarePicture5.name);
    }
    if (req.files.todaysCarePicture6) {
        var todaysCarePicture6 = 'todays_' + req.files.todaysCarePicture6.name;
        files.push(req.files.todaysCarePicture6.name);
    }
    if (req.files.todaysCarePicture7) {
        var todaysCarePicture7 = 'todays_' + req.files.todaysCarePicture7.name;
        files.push(req.files.todaysCarePicture7.name);
    }
    if (req.files.todaysCarePicture8) {
        var todaysCarePicture8 = 'todays_' + req.files.todaysCarePicture8.name;
        files.push(req.files.todaysCarePicture8.name);
    }
    if (req.files.todaysCarePicture9) {
        var todaysCarePicture9 = 'todays_' + req.files.todaysCarePicture9.name;
        files.push(req.files.todaysCarePicture9.name);
    }
    if (req.files.todaysCarePicture10) {
        var todaysCarePicture10 = 'todays_' + req.files.todaysCarePicture10.name;
        files.push(req.files.todaysCarePicture10.name);
    }
    var todaysCareCategory = req.body.todaysCareCategory;

    if (todaysCareTitle == '') {
        res.json({"success": 0, "result": {"message": "오늘의 육아 제목 없음, 오늘의 육아 쓰기 실패"}});
    } else if (todaysCareContent == '') {
        res.json({"success": 0, "result": {"message": "오늘의 육아 내용 없음, 오늘의 육아 쓰기 실패"}});
    } else if (!memberId) {
        res.json({"success": 0, "result": {"message": "로그인 안됨, 오늘의 육아 쓰기 실패"}});
    } else if (memberId != 'admin') {
        res.json({"success": 0, "result": {"message": "관리자 아님, 오늘의 육아 쓰기 실패"}});
    } else {
        async.waterfall([
            function (callback) {
                picture.todays(req.files.todaysCarePicture1, files, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                })
            },
            function (callback) {
                var datas = [memberId, todaysCareTitle, todaysCareContent, todaysCareThumbnail, todaysCarePicture1, todaysCarePicture2,
                    todaysCarePicture3, todaysCarePicture4, todaysCarePicture5, todaysCarePicture6,
                    todaysCarePicture7, todaysCarePicture8, todaysCarePicture9, todaysCarePicture10, todaysCareCategory];
                logger.debug('datas', datas);
                db_admin.todaysWrite(datas, function (err, success) {
                    if (err) {
                        callback(err);
                    } else {
                        if (success) {
                            callback(null);
                        } else {
                            callback('err');
                        }
                    }
                })
            }
        ], function (err) {
            if (err) {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
                'history.back();</script></head>')
            } else {
                res.redirect('/admin/todays/1');
            }
        })
    }
})

// 오늘의 육아 읽기
router.get('/todaysRead/:page/:todaysCareNum', function (req, res) {
    var page = req.params.page;
    var todaysCareNum = req.params.todaysCareNum;
    var memberId = req.session.user_id;
    var datas = [todaysCareNum * 1, memberId];
    logger.debug('datas', datas);
    db_admin.todaysRead(datas, function (data) {
        if (data) {
            res.render('admin/todays/read', {
                title: "오늘의 육아 읽기",
                data: data,
                page: page,
                memberId: memberId
            });
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

// 오늘의 육아 수정 폼
router.get('/todaysModify/:page/:todaysCareNum', function (req, res) {
    var page = req.params.page;
    var todaysCareNum = req.params.todaysCareNum;
    var memberId = req.session.user_id;
    logger.debug('todaysCareNum', todaysCareNum);
    db_admin.todaysModifyform(todaysCareNum * 1, function (data) {
        if (data) {
            res.render('admin/todays/modifyform', {
                title: "오늘의 육아 수정",
                data: data,
                page: page,
                memberId: memberId
            });
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
});

// 오늘의 육아 수정
router.post('/todaysModify', function (req, res) {
    var page = req.body.page;
    var todaysCareNum = req.body.todaysCareNum;
    var todaysCareTitle = req.body.todaysCareTitle;
    var todaysCareContent = req.body.todaysCareContent;
    var todaysCareCategory = req.body.todaysCareCategory;
    var datas = [todaysCareTitle, todaysCareContent, todaysCareCategory * 1, todaysCareNum * 1];
    logger.debug('datas', datas);
    db_admin.todaysModify(datas, function (success) {
        if (success) {
            res.redirect('/admin/todaysRead/' + page + '/' + todaysCareNum);
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

//오늘의 육아 삭제
router.post('/todaysDelete', function (req, res) {
    var page = req.body.page;
    var todaysCareNum = req.body.todaysCareNum;
    //res.json({"aa":"Aa"})
    db_admin.todaysDelete(todaysCareNum * 1, function (success) {
        if (success) {
            res.redirect('/admin/todays/' + page);
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

////////////////////////////////////////////////////////////공지사항
//공지사항
router.get('/notice', function (req, res) {
    //res.render('admin/todays', {title: 'Todays', id : req.session.user_id});
    res.redirect('/admin/notice/1');
});
//공지사항 리스트
router.get('/notice/:page', function (req, res) {
    var page = req.params.page;
    var memberId = req.session.user_id;
    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈

    db_admin.noticeList(page, function (datas) {
        if (datas) {
            res.render('admin/notice', {title: 'Notice', memberId: memberId, datas: datas});

        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });
})


//공지사항 쓰기 폼
router.get('/noticeWrite', function (req, res) {
    //res.json({'aaa':"aaa"})
    var memberId = req.session.user_id;

    res.render('admin/notice/writeform', {title: '공지사항 쓰기', memberId: memberId});

})
//공지사항 쓰기
router.post('/noticeWrite', function (req, res) {
    var memberId = req.session.user_id;
    var noticeContent = req.body.noticeContent;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 공지사항 쓰기 실패"}});
    } else if (memberId != 'admin') {
        res.json({"success": 0, "result": {"message": "관리자 아님, 공지사항 쓰기 실패"}});
    } else if (!noticeContent) {
        res.json({"success": 0, "result": {"message": "공지사항 내용 없음, 공지사항 쓰기 실패"}});
    } else {
        var datas = [memberId, noticeContent];
        db_admin.noticeWrite(datas, function (success) {
            if (success) {
                res.redirect('/admin/notice/1');
            } else {
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
                'history.back();</script></head>')
            }
        })
    }
})

// 공지사항 읽기
router.get('/noticeRead/:page/:todaysCareNum', function (req, res) {
    var page = req.params.page;
    var todaysCareNum = req.params.todaysCareNum;
    var memberId = req.session.user_id;
    var datas = [todaysCareNum * 1, memberId];
    db_admin.noticeRead(datas, function (data) {
        if (data) {
            res.render('admin/notice/read', {
                title: "공지사항 읽기",
                data: data,
                page: page,
                memberId: memberId
            });
            //res.json({title:"오늘의 육아 읽기", data:data, page:page});

        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

//공지사항 수정폼
router.get('/noticeModify/:page/:noticeNum', function (req, res) {
    var page = req.params.page;
    var noticeNum = req.params.noticeNum;
    var memberId = req.session.user_id;
    db_admin.noticeModifyform(noticeNum * 1, function (data) {
        if (data) {
            res.render('admin/notice/modifyform', {
                title: "공지사항 수정",
                data: data,
                page: page,
                memberId: memberId
            });
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })

})

//공지사항 수정
router.post('/noticeModify', function (req, res) {
    var noticeNum = req.body.noticeNum;
    var noticeContent = req.body.noticeContent;
    var page = req.body.page;
    var datas = [noticeContent, noticeNum * 1]
    db_admin.noticeModify(datas, function (success) {
        if (success) {
            res.redirect('/admin/noticeRead/' + page + '/' + noticeNum);
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})


//공지사항 삭제
router.post('/noticeDelete', function (req, res) {
    var page = req.body.page;
    var noticeNum = req.body.noticeNum;
    db_admin.noticeDelete(noticeNum * 1, function (success) {
        if (success) {
            res.redirect('/admin/notice/' + page);
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

//////////////////////////////////////////////////////제품관리
//제품관리
router.get('/product', function (req, res) {
    //res.render('admin/todays', {title: 'Todays', id : req.session.user_id});
    res.redirect('/admin/product/1');

});

//제품 리스트
router.get('/product/:page', function (req, res) {
    var page = req.params.page;
    var memberId = req.session.user_id;
    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈
    db_admin.productList(page, function (datas) {
        if (datas) {
            res.render('admin/product', {title: 'Product', memberId: memberId, datas: datas});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });


})


//제품 등록 폼
router.get('/productWrite', function (req, res) {
    var memberId = req.session.user_id;

    res.render('admin/product/writeform', {title: '제품 등록', memberId: memberId});
})

//제품 등록
//기억 안날까봐... 플래그를 처리해서 다시 짜야할듯 하다. 등록제품이 복수일 경우는 1, 아닐경우 0 으로 해서 판별할 수 있도록 하자.
router.post('/productWrite', function (req, res) {
    var productBrand = req.body.productBrand;
    var productCategory1 = req.body.productCategory1;
    var productCategory2 = req.body.productCategory2;
    var productName = req.body.productName;
    var productAge = req.body.productAge;
    var productStartAge = [];
    var productEndAge = [];
    var datas = [];
    logger.debug('req.body', req.body);

    async.waterfall([
        function (callback) {
            if(Array.isArray(productAge)){
                for (var i = 0; i < productAge.length; i++) {
                    var temp = productAge[i].split('~');
                    productStartAge.push(temp[0]);
                    productEndAge.push(temp[1]);
                }
            } else {
                var temp = productAge.split('~');
                productStartAge.push(temp[0]);
                productEndAge.push(temp[1]);
            }
            callback(null, productStartAge, productEndAge)
        },
        function (productStartAge, productEndAge, callback) {
            if(Array.isArray(productBrand)){
                for (var j = 0; j < productBrand.length; j++) {
                    var test = [];
                    test.push(productBrand[j]);
                    test.push(productCategory1[j]);
                    test.push(productCategory2[j]);
                    test.push(productName[j]);
                    test.push(productStartAge[j]);
                    test.push(productEndAge[j]);
                    datas.push(test);
                }
                logger.debug('datas', datas);
            } else {
                datas = [productBrand, productCategory1, productCategory2, productName, productStartAge, productEndAge];
            }
            callback(null, datas);

        },
        function (datas, callback) {
            async.eachSeries(datas, function (data, callback) {
                    logger.debug('datas1',data);
                    db_admin.productWrite(data, function (err, success) {
                        if (err) {
                            callback(err);
                        } else {
                            if(success){
                                callback(null);
                            } else {
                                callback('err');
                            }
                        }
                    })
                }, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                }
            )
        }
    ], function (err) {
        if (err) {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        } else {
            res.redirect('/admin/product/1');
        }
    })
})


//제품 수정 폼
router.get('/productModify/:page/:productNum', function (req, res) {
    var page = req.params.page;
    var productNum = req.params.productNum;
    var memberId = req.session.user_id;
    db_admin.productModifyform(productNum * 1, function (data) {
        if (data) {
            res.render('admin/product/modifyform', {
                title: "제품 수정",
                data: data,
                page: page,
                memberId: memberId
            });
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

//제품 수정
router.post('/productModify', function (req, res) {
    var page = req.body.page;
    var productBrand = req.body.productBrand;
    var productName = req.body.productName;
    var productCategory1 = req.body.productCategory1;
    var productCategory2 = req.body.productCategory2;
    var productNum = req.body.productNum;
    var productAge = req.body.productAge;
    var temp = productAge.split('~');
    var productStartAge = temp[0];
    var productEndAge = temp[1];
    var datas = [productBrand, productCategory1, productCategory2, productName, productStartAge, productEndAge, productNum];
    db_admin.productModify(datas, function (success) {
        if (success) {
            res.redirect('/admin/product/' + page);
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });
});

//제품 삭제
router.post('/productDelete', function (req, res) {
    var productNum = req.body.productNum;
    var page = req.body.page;

    db_admin.productDelete(productNum * 1, function (success) {
        if (success) {
            res.redirect('/admin/product/' + page);
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

router.get('/productSearch', function (req, res) {
    res.redirect('/admin/product/1');
})


//제품 검색
router.get('/productSearch/:page/:search/:query', function (req, res) {
    var page = req.params.page;
    var search = req.params.search;
    var query = req.params.query;
    var memberId = req.session.user_id;
    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈
    var datas = [page * 1, search * 1, query];


    db_admin.productSearch(datas, function (data) {
        if (data) {
            res.render('admin/product/search', {
                title: 'Product Search',
                memberId: memberId,
                datas: data
            });

        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })


})

router.get('/report', function (req, res) {
    //res.render('admin/todays', {title: 'Todays', id : req.session.user_id});
    res.redirect('/admin/report/1');
});

//Report 리스트
router.get('/report/:page', function (req, res) {
    var page = req.params.page;
    var memberId = req.session.user_id;
    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈

    db_admin.reportList(page, function (datas) {
        if (datas) {
            res.render('admin/report', {title: 'report', memberId: memberId, datas: datas});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });
})

router.post('/reportComplete', function (req, res) {
    var page = req.body.page;
    var memberId = req.body.memberId;
    var reviewNum = req.body.reviewNum;
    var datas = [memberId, reviewNum];
    db_admin.reportComplete(datas, function (success) {
        if (success) {
            res.redirect('/admin/report/' + page);
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

router.get('/member', function (req, res) {
    //res.render('admin/todays', {title: 'Todays', id : req.session.user_id});
    res.redirect('/admin/member/1');
});

//검색
router.get('/member/search=:search&check=:check', function (req, res) {
    var page = 1;
    var memberId = req.session.user_id;
    var search = req.params.search;
    var check = req.params.check;

    if (search == undefined) {
        search = '';
    }

    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈

    var datas = [page, search, check];

    logger.debug('datas', datas);

    db_admin.memberList(datas, function (data) {
        if (datas) {
            res.render('admin/member', {title: 'member', memberId: memberId, datas: data});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });
});

//Member 리스트
router.get('/member/:page', function (req, res) {
    var page = req.params.page;
    var memberId = req.session.user_id;
    var search = req.params.search;

    if (search == undefined) {
        search = '';
    }

    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈

    var datas = [page, search];

    logger.debug('datas', datas);

    db_admin.memberList(datas, function (data) {
        if (datas) {
            res.render('admin/member', {title: 'member', memberId: memberId, datas: data});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });
});


router.post('/regblack', function (req, res) {
    var page = req.body.page;
    var memberId = req.body.memberId;
    var datas = [memberId];
    db_admin.regblack(datas, function (success) {
        if (success) {
            // res.redirect('/admin/member/'+page);
            res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

router.post('/releaseblack', function (req, res) {
    var page = req.body.page;
    var memberId = req.body.memberId;
    var datas = [memberId];
    db_admin.releaseblack(datas, function (success) {
        if (success) {
            // res.redirect('/admin/member/'+page);
            res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

//마이페이지
router.get('/memberRead/:memberId', function (req, res, next) {
    var memberId = req.session.user_id;
    var id = req.params.memberId;

    if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 회원 정보 조회 페이지 실패"}});
    } else if (!id) {
        res.json({"success": 0, "result": {"message": "조회용 아이디 없음, 회원 정보 조회 페이지 실패"}});
    } else {
        db_admin.memberRead(id, function (data) {
            if (data) {
                // res.json({"success": 1, "result": {"message": "마이페이지 성공", "myPageData": datas}});
                res.render('admin/memberRead', {
                    title: 'memberRead',
                    memberId: memberId,
                    data: data
                });
            } else {
                // res.json({"success": 0, "result": {"message": "프로필 읽기 실패"}});
                res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
                'history.back();</script></head>');
            }
        });
    }
});

router.get('/review', function (req, res) {
    //res.render('admin/todays', {title: 'Todays', id : req.session.user_id});
    res.redirect('/admin/review/1');
});

//리뷰 리스트
router.get('/review/:page', function (req, res) {
    var page = req.params.page;
    var memberId = req.session.user_id;
    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈
    db_admin.reviewList(page, function (datas) {
        if (datas) {
            res.render('admin/review', {title: 'review', memberId: memberId, datas: datas});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });
});

//리뷰 읽기
router.get('/review/:page/:reviewNum', function (req, res) {
    var page = req.params.page;
    var reviewNum = req.params.reviewNum;
    var memberId = req.session.user_id;
    var datas = [reviewNum * 1, memberId];
    db_admin.reviewRead(datas, function (data) {
        if (data) {
            res.render('admin/review/read', {
                title: "리뷰 읽기",
                data: data,
                page: page,
                memberId: memberId
            });
            //res.json({title:"오늘의 육아 읽기", data:data, page:page});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

//리뷰 삭제
router.post('/reviewDelete', function (req, res) {
    var page = req.body.page;
    var reviewNum = req.body.reviewNum;
    db_admin.reviewDelete(reviewNum * 1, function (success) {
        if (success) {
            res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

//리뷰 - 제품번호 수정
router.post('/reviewModifyProduct', function (req, res) {
    var productNum = req.body.productNum;
    var reviewNum = req.body.reviewNum;
    var data = [productNum * 1, reviewNum * 1];
    logger.debug('data', data);
    //res.json({"aa":"Aa"})
    db_admin.reviewModifyProduct(data, function (success) {
        if (success) {
            res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

router.get('/choice', function (req, res) {
    //res.render('admin/todays', {title: 'Todays', id : req.session.user_id});
    res.redirect('/admin/choice/1');
});

//리뷰 리스트
router.get('/choice/:page', function (req, res) {
    var page = req.params.page;
    var memberId = req.session.user_id;
    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈
    db_admin.choiceList(page, function (datas) {
        if (datas) {
            res.render('admin/choice', {title: 'choice', memberId: memberId, datas: datas});
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    });
});

//choice 읽기
router.get('/choice/:page/:voteNum', function (req, res) {
    var page = req.params.page;
    var voteNum = req.params.voteNum;
    var memberId = req.session.user_id;
    var datas = [voteNum * 1, memberId];
    db_admin.choiceRead(datas, function (data) {
        if (data) {
            res.render('admin/choice/read', {
                title: "초이스 읽기",
                data: data,
                page: page,
                memberId: memberId
            });
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

router.post('/voteDelete', function (req, res) {
    var page = req.body.page;
    var voteNum = req.body.voteNum;
    //res.json({"aa":"Aa"})
    db_admin.voteDelete(voteNum * 1, function (success) {
        if (success) {
            res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

router.post('/voteReplyDelete', function (req, res) {
    var page = req.body.page;
    var voteReplyNum = req.body.voteReplyNum;
    //res.json({"aa":"Aa"})
    db_admin.voteReplyDelete(voteReplyNum * 1, function (success) {
        if (success) {
            res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

//리뷰 - 제품번호 수정
router.post('/reviewReplyDelete', function (req, res) {
    var page = req.body.page;
    var reviewReplyNum = req.body.reviewReplyNum;
    //res.json({"aa":"Aa"})
    db_admin.reviewReplyDelete(reviewReplyNum * 1, function (success) {
        if (success) {
            res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
        } else {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        }
    })
})

router.get('/testparallel', function (req, res) {
    var indexNum = 3;
    db_admin.testparallel(indexNum, function (datas) {
        res.json({result: datas});
    })
})


/****************************이벤트*****************************/
router.get('/event', function (req, res) {
    res.redirect('/admin/event/1');
});

router.get('/event/:page', function (req, res) {
    var page = req.params.page;
    var memberId = req.session.user_id;
    page = parseInt(page, 10);  //문자로 넘어온 page를 10진수 수로 바꿈
    db_admin.eventList(page, function (err, datas) {
        if (err) {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        } else {
            //res.json({"gg":datas})
            res.render('admin/event', {title: 'event', memberId: memberId, datas: datas});
        }
    });

});


router.get('/eventWrite', function (req, res) {
    var memberId = req.session.user_id;
    res.render('admin/event/writeform', {title: '이벤트 등록', memberId: memberId});
})


router.post('/eventWrite', function (req, res) {
    var eventPicture;
    async.waterfall([
        function (callback) {
            if (req.files.eventPicture) {
                picture.event(req.files.eventPicture.name, function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        eventPicture = data;
                        callback(null);
                    }
                })
            } else {
                callback(null);
            }
        },
        function (callback) {
            var eventTitle = req.body.eventTitle;
            var datas = [eventTitle, eventPicture];
            db_admin.addEvent(datas, function (err, success) {
                if (err) {
                    callback(err);
                } else {
                    if (success) {
                        callback(null);
                    } else {
                        callback('error');
                    }
                }
            })
        }
    ], function (err) {
        if (err) {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        } else {
            res.redirect('/admin/event');
        }
    })
});

router.post('/eventDel', function(req, res){
    var eventNum = req.body.eventNum;
    var eventDel = req.body.eventDel;

    if(eventDel==1){
        var eventFlag=0
    } else if(eventDel==0) {
        var eventFlag=1
    }
    var datas = [eventFlag, eventNum];
    db_admin.eventDel(datas, function(err){
        if (err) {
            res.send('<head><meta charset="utf-8"><script>alert("에러가 발생하여 되돌아갑니다!!");' +
            'history.back();</script></head>')
        } else {
            res.send('<head><meta charset="uft-8"><script>window.location.href = document.referrer</script></head>');
        }
    })

})

module.exports = router;
