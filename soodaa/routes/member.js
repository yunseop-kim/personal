var express = require('express');
var router = express.Router();
var path = require('path');
var graph = require('fbgraph');
var async = require('async');
var logger = require('../etc/logger');
var db_members = require('../models/db_members');

var facebook = require('../etc/facebook');
var crypto = require('../etc/crypto');
var mailer = require('../etc/mailer');
var picture = require('../etc/picture');


//회원가입
router.post('/join', function (req, res, next) {
    var memberId = req.body.memberId;
    var inputpass = req.body.memberPasswd;
    var memberName = req.body.memberName;
    var memberBirth = req.body.memberBirth;

    if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 회원가입 실패"}});
    } else if (!inputpass) {
        res.json({"success": 0, "result": {"message": "비밀번호 없음, 회원가입 실패"}});

    } else if (!memberName) {
        res.json({"success": 0, "result": {"message": "이름 없음, 회원가입 실패"}});

    } else if (!memberBirth) {
        res.json({"success": 0, "result": {"message": "생년월일 없음, 회원가입 실패"}});

    } else {
        crypto.myCrypto(inputpass, function (err, cryptoPass) {
            if (err) {
                res.json({"success": 0, "result": {"message": err}});
            } else {
                var memberPasswd = cryptoPass;
                var datas = [memberId, memberPasswd, memberName, memberBirth, memberId];
                logger.debug('datas', datas);
                db_members.join(datas, function (err, message, success) {
                    if (err) {
                        res.json({"success": 0, "result": {"message": message}});
                    } else {
                        if (success == 1) {
                            res.json({"success": 1, "result": {"message": "회원가입 성공"}});
                        } else if (success == 2) {
                            res.json({"success": 0, "result": {"message": "중복된 아이디 있음, 회원가입 실패"}});
                        } else {
                            res.json({"success": 0, "result": {"message": "회원가입 실패"}});

                        }
                    }
                });
            }
        })


    }
});

//로그인
router.post('/login', function (req, res, next) {
    var memberId = req.body.memberId;
    var inputpass = req.body.memberPasswd;
    var registrationId = req.body.registrationId;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 로그인 실패"}});
    } else if (!inputpass) {
        res.json({"success": 0, "result": {"message": "비밀번호 없음, 로그인 실패"}});
    } else if (!registrationId) {
        res.json({"success": 0, "result": {"message": "gcmID 없음, 로그인 실패"}});
    } else {
        crypto.myCrypto(inputpass, function (err, cryptoPass) {
            if (err) {
                res.json({"success": 0, "result": {"message": err}});
            } else {
                var memberPasswd = cryptoPass;
                var datas = [memberId, memberPasswd, registrationId];
                db_members.login(datas, function (err, message, success, babyBirth, isBabyChecked) {
                    if (err) {
                        res.json({"success": 0, "result": {"message": message}});
                    } else {
                        if (success) {
                            req.session.user_id = memberId;
                            req.session.babyBirth = babyBirth;
                            res.json({
                                "success": 1,
                                "result": {"message": "로그인 성공", "isBabyChecked": isBabyChecked}
                            });
                        } else {
                            res.json({
                                "success": 0,
                                "result": {"message": "로그인 실패"}
                            });
                        }
                    }
                })
            }
        })
    }
});


//페이스북 로그인
router.post('/fb_login', function (req, res) {
    async.waterfall([
        function (callback) {
            var memberFbAccessToken = req.body.memberFbAccessToken;
            logger.debug('fb_login', memberFbAccessToken);
            facebook.fb_mlogin(memberFbAccessToken, function (err, data) {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, data)
                }
            })
        },
        function (data, callback) {
            var memberFbAccessToken = req.body.memberFbAccessToken;
            var registrationId = req.body.registrationId;

            var datas = [memberFbAccessToken, data[0], data[1], data[2], registrationId, data[3], data[4]];

            db_members.fb_login(datas, function (err, message, success, babyBirth, isBabyChecked) {
                callback(err, message, success, babyBirth, isBabyChecked, datas[1]);
            })
        }
    ], function (err, message, success, babyBirth, isBabyChecked, memberId) {
        if (err) {
            res.json({"success": 0, "result": {"message": err}});
        } else {
            req.session.user_id = memberId;
            req.session.babyBirth = babyBirth;
            res.json({
                "success": 1,
                "result": {"message": message, "isBabyChecked": isBabyChecked}
            });
        }
    })
});


//비밀번호 찾기
router.post('/passwd', function (req, res, next) {
    var memberId = req.body.memberId;
    if (memberId == '') {
        res.json({"success": 0, "result": {"message": "아이디 없음, 비밀번호 찾기 실패"}});
    } else {
        var passwdnumber = "" + Math.round(new Date().valueOf() * Math.random()); //계속 바뀌는 string
        var datas = [passwdnumber, memberId];
        db_members.find(datas, function (err, message, success) {
            if (err) {
                res.json({"success": 0, "result": {"message": err}});
            } else {
                if (success) {
                    mailer.mailsend(datas, function (err) {
                        if (err) {
                            res.json({"success": 0});
                        } else {
                            res.json({"success": 1});
                        }
                    });
                } else {
                    res.json({"success": 0});
                }
            }
        })
    }
});

//비밀번호 찾기 폼
router.get('/passwdfind/:memberFind', function (req, res, next) {
    var memberFind = req.params.memberFind;
    db_members.passchangeform(memberFind, function (err, message, success) {
        if (err) {
            res.json({"success": 0, "result": {"message": message}});
        } else {
            if (success) {
                res.render('member/passwd', {title: '회원관리', memberFind: memberFind});
            } else {
                res.json({"success": 0, "result": {"message": "유효 하지 않은 페이지"}});
            }
        }
    })
});

//비밀번호 변경
router.post('/passwdfind', function (req, res, next) {
    var memberFind = req.body.memberFind;
    var inputpass = req.body.memberPasswd;

    if (!inputpass) {
        res.json({"success": 0, "result": {"message": "비밀번호 없음, 비밀번호 변경 실패"}});
    } else {
        crypto.myCrypto(inputpass, function (err, cryptoPass) {
            if (err) {
                res.json({"success": 0, "result": {"message": err}});
            } else {
                var memberPasswd = cryptoPass;
                var datas = [memberPasswd, memberFind];
                db_members.passchange(datas, function (err, message, success) {
                    if (err) {
                        res.json({"success": 0, "result": {"message": message}});
                    } else {
                        if (success) {
                            res.json({"success": 1, "result": {"message": message}});
                        } else {
                            res.json({"success": 0, "result": {"message": message}});
                        }
                    }
                })
            }
        })
    }
});

// 로그아웃
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            logger.error('err', err);
            res.json({"success": 0, "result": {"message": "로그아웃 실패"}});
        } else {
            res.json({"success": 1, "result": {"message": "로그아웃 성공"}});
        }
    });
});

//프로필 보기
router.get('/read', function (req, res, next) {
    var memberId = req.session.user_id;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 프로필 읽기 실패"}});
    } else {
        db_members.read(memberId, function (err, message, data) {
            if (err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if (data) {
                    res.json({"success": 1, "result": {"message": message, "data": data}});
                } else {
                    res.json({"success": 0, "result": {"message": "프로필 읽기 실패"}});
                }
            }

        })
    }
});

//프로필 수정
router.post('/modify', function (req, res, next) {

    var memberId = req.session.user_id;
    var memberName = req.body.memberName;
    var memberBirth = req.body.memberBirth;
    var memberAddress = req.body.memberAddress;

    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음,프로필 수정 실패"}});
    } else if (!memberName) {
        res.json({"success": 0, "result": {"message": "이름 없음, 프로필 수정 실패"}});
    } else {
        async.waterfall([
            function (callback) {
                if (req.files.memberPicture) {
                    picture.member(req.files.memberPicture.name, function (err) {
                        if (err) {
                            callback(err, '파일 전송 에러');
                        } else {
                            var memberPicture = 'member_' + req.files.memberPicture.name;
                            var datas = [memberPicture, memberName, memberBirth, memberAddress, memberId];
                            callback(null, datas);
                        }
                    })
                } else {
                    var datas = [memberName, memberBirth, memberAddress, memberId];
                    callback(null, datas);
                }
            },
            function (datas, callback) {
                db_members.modify(datas, function (err, message, success) {
                    if (err) {
                        callback(err, message);
                    } else {
                        if (success) {
                            callback(null, message);
                        } else {
                            callback('err', message);
                        }
                    }
                })
            }
        ], function (err, message) {
            if (err) {
                res.json({"success": 0, "result": {"message": message}});

            } else {
                res.json({"success": 1, "result": {"message": message}});
            }
        })
    }
});


//마이페이지
router.get('/mypage', function (req, res, next) {
    var memberId = req.query.memberId;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": " 아이디 없음, 마이 페이지 실패"}});
    } else {
        db_members.mypage(memberId, function (err, data) {
            if (err) {
                res.json({"success": 0, "result": {"message": "프로필 읽기 실패"}});
            } else {
                res.json({"success": 1, "result": {"message": "마이페이지 성공", "myPageData": data}});
            }
        });
    }
});


//찜한 목록
router.get('/zzim', function (req, res, next) {
    var memberId = req.query.memberId;
    var start = req.query.start;
    var count = req.query.count;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 찜한 목록 보기 실패"}});
    } else if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 찜한 목록 보기 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 찜한 목록 보기 실패"}});
    } else {
        var datas = [memberId, start, count];
        db_members.zzim(datas, function (err, message, data) {
            if (err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if (data) {
                    res.json({"success": 1, "result": {"message": message, "zzimList": data}});
                } else {
                    res.json({"success": 0, "result": {"message": "찜목록 실패"}});
                }
            }

        })
    }
});

//내가 올린 게시글
router.get('/mylist', function (req, res) {
    var memberId = req.query.memberId;
    var start = req.query.start;
    var count = req.query.count;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 찜한 목록 보기 실패"}});
    } else if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 찜한 목록 보기 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 찜한 목록 보기 실패"}});
    } else {
        var datas = [memberId, start, count];
        db_members.mylist(datas, function (err, message, data) {
            if (err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if (data) {
                    res.json({"success": 1, "result": {"message": message, "writeList": data}});
                } else {
                    res.json({"success": 0, "result": {"message": "내가 올린 게시글 실패"}});
                }
            }
        })
    }
});

//사이드 메뉴
router.get('/sidemenu', function (req, res) {
    var memberId = req.session.user_id;
    if (!req.session.user_id) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 사이드 메뉴 보기 실패"}});
    } else {
        db_members.sidemenu(memberId, function (err, data) {
            if(err) {
                res.json({"success": 0, "result": {"message": "사이드 메뉴 실패"}});

            } else {
                res.json({"success": 0, "result": {"message": "사이드 메뉴 성공", "data" : data}});

            }
        })
    }
})


router.get('/getKeyword', function (req, res) {
    db_members.getKeyword(function (err, data) {
        if (err) {
            res.json({"success": 0, "result": {"message": err}});
        } else {
            res.json({"success": 1, "result": {"message": "키워드 성공", "data": data}});
        }
    })

})

module.exports = router;
