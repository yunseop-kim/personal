var express = require('express');
var router = express.Router();
var async = require('async');

var db_baby = require('../models/db_baby');
var picture = require('../etc/picture');
var logger = require('../etc/logger');

//아이 보기
router.get('/read', function (req, res, next) {
    var memberId = req.session.user_id;
    if (!req.session.user_id) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 아이 보기 실패"}});
    } else {
        var datas = [memberId];
        db_baby.read(datas, function (err, data) {
            if (err) {
                res.json({"success": 0, "result": {"message": "아이 보기 실패"}});
            } else {
                res.json({"success": 1, "result": {"message": "아이 보기 성공", "babyList": data}});
            }
        });
    }
});

//아이 추가
router.post('/add', function (req, res, next) {
    var memberId = req.session.user_id;
    var babyName = req.body.babyName;
    var babyBirth = req.body.babyBirth;
    var babyGender = req.body.babyGender;
    var babyIsChecked = req.body.babyIsChecked;
    var babyPicture = 'baby_default.jpg';

    if (!req.session.user_id) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 아이 추가 실패"}});
    } else if (babyName == '') {
        res.json({"success": 0, "result": {"message": "이름 없음, 아이 추가 실패"}});
    } else if (babyBirth == '') {
        res.json({"success": 0, "result": {"message": "생년월일 없음, 아이 추가 실패"}});
    } else if (babyGender == '') {
        res.json({"success": 0, "result": {"message": "성별 없음, 아이 추가 실패"}});
    } else {
        async.waterfall([
            function (callback) { // 파일 저장
                if (req.files.babyPicture) {
                    picture.baby(req.files.babyPicture.name, function (err, data) {
                        if (err) {
                            logger.error('err', err);
                            callback(err);
                        } else {
                            babyPicture = data;
                            callback(null);
                        }
                    })
                } else {
                    callback(null);
                }
            },
            function (callback) { // DB 저장
                var datas = [memberId, babyName, babyBirth, babyGender, babyPicture, babyIsChecked];
                db_baby.add(datas, function (err, success) {
                    if (err) {
                        logger.error('err', err);
                        callback(err);
                    } else {
                        if (success == 1) {     // 대표아이
                            req.session.babyBirth = babyBirth;
                            callback(null);
                        } else if (success == 2) { // 임신 중
                            req.session.babyBirth = new Date();
                            callback(null);
                        } else if (success == 3) { // 대표아이 아님
                            callback(null);
                        }
                    }
                });
            }
        ], function (err) {
            if (err) {
                res.json({"success": 0, "result": {"message": "아이 추가 실패"}});
            } else {
                res.json({"success": 1, "result": {"message": "아이 추가 성공"}});
            }
        }) // async
    }
});
//아이 수정
router.post('/modify', function (req, res, next) {
    var memberId = req.session.user_id;
    var babyName = req.body.babyName;
    var babyBirth = req.body.babyBirth;
    var babyGender = req.body.babyGender;
    var babyNum = req.body.babyNum;
    var babyIsChecked = req.body.babyIsChecked;

    if (!memberId) {
        res.json({"success": 0, "result": {"message": "아이디 없음, 아이 수정 실패"}});
    } else if (!babyNum) {
        res.json({"success": 0, "result": {"message": "아이 번호 없음, 아이 수정 실패"}});
    } else if (!babyName) {
        res.json({"success": 0, "result": {"message": "이름 없음, 아이 수정 실패"}});
    } else if (!babyBirth) {
        res.json({"success": 0, "result": {"message": "생년월일 없음, 아이 수정 실패"}});
    } else if (!babyGender) {
        res.json({"success": 0, "result": {"message": "성별 없음, 아이 수정 실패"}});
    } else if (!babyIsChecked) {
        res.json({"success": 0, "result": {"message": "대표아이 설정 없음, 아이 수정 실패"}});
    } else {
        async.waterfall([
            function (callback) {
                if (req.files.babyPicture) {
                    picture.baby(req.files.babyPicture.name, function (err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            var babyPicture = data;
                            var datas = [babyIsChecked * 1, babyGender * 1, babyName, babyBirth, babyPicture, babyNum * 1, memberId];
                            callback(null, datas);
                        }
                    })
                } else {
                    var datas = [babyIsChecked * 1, babyGender * 1, babyName, babyBirth, babyNum * 1, memberId];
                    callback(null, datas);
                }
            },
            function (datas, callback) {
                logger.debug('datas', datas);
                db_baby.modify(datas, function (err, success) {
                    if (err) {
                        callback(err);
                    } else {
                        if (success == 1) {
                            callback(null);
                        } else if (success == 2) {
                            req.session.babyBirth = babyBirth;
                            callback(null);
                        }
                    }
                });
            }
        ], function (err) {
            if (err) {
                res.json({"success": 0, "result": {"message": "아이 정보 수정 실패"}});
            } else {
                res.json({"success": 1, "result": {"message": "아이 정보 수정 성공"}});
            }
        })
    }
});


//아이 정보 삭제
router.post('/delete', function (req, res, next) {
    var memberId = req.session.user_id;
    var babyNum = req.body.babyNum;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 아이 삭제 실패"}});
    } else if (babyNum == '') {
        res.json({"success": 0, "result": {"message": "아이 번호 없음, 아이 삭제 실패"}});
    } else {
        var data = [babyNum * 1, memberId];
        db_baby.delete(data, function (success) {
            if (success) {
                res.json({"success": 1, "result": {"message": "아이 삭제 성공"}});
            } else {
                res.json({"success": 0, "result": {"message": "아이 삭제 실패"}});
            }
        })
    }
});


//아이 선택 ( 리뷰 - 내아이 맞춤 볼 때 필요.)
router.post('/babyselect', function (req, res, next) {
    var memberId = req.session.user_id;
    var babyBirth = req.body.babyBirth;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 아이 생일 정보 등록 실패"}});
    } else if (babyBirth == '') {
        res.json({"success": 0, "result": {"message": "아이 생일 없음, 아이 생일 정보 등록 실패"}});
    } else {
        req.session.babyBirth = babyBirth;
        res.json({"success": 1, "result": {"message": "아이 생일 정보 등록 성공"}});
    }
});


module.exports = router;
