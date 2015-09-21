var express = require('express');
var router = express.Router();
var fs = require('fs');
var db_todays = require('../models/db_todays');
var logger = require('../etc/logger');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/list', function (req, res) {
    var start = req.query.start;
    var count = req.query.count;
    var arrange = req.query.arrange;
    if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 공지사항 리스트 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 공지사항 리스트 실패"}});
    } else if (!arrange) {
        res.json({"success": 0, "result": {"message": "카테고리 없음, 공지사항 리스트 실패"}});
    } else {
        var datas = [start*1, count*1, arrange*1];
        if (arrange == 0) { // 육아
            db_todays.list(datas, function (data) {
                if (data) {
                    res.json({"success": 1, "result": {"message": "오늘의 육아 리스트 성공", "todaysList": data}});
                } else {
                    res.json({"success": 0, "result": {"message": "오늘의 육아 리스트 실패"}});
                }
            })
        } else {
            db_todays.list_cate(datas, function (data) {
                if (data) {
                    res.json({"success": 1, "result": {"message": "오늘의 육아 리스트 성공", "todaysList": data}});
                } else {
                    res.json({"success": 0, "result": {"message": "오늘의 육아 리스트 실패"}});
                }
            })
        }
    }

});


//오늘의 육아 읽기
router.get('/read', function (req, res, next) {
    var todaysCareNum = req.query.todaysCareNum;
    var memberId = req.session.user_id;

    if (!todaysCareNum) {
        res.json({"success": 0, "result": {"message": "오늘의 육아 번호 없음, 오늘의 육아 읽기 실패"}});
    }  else {
        var datas = [todaysCareNum*1, memberId];
        db_todays.read(datas, function(data) {
            if (data) {
                res.json({"success": 1, "result": {"message": "오늘의 육아 보기 성공", "todaysContents": data}});
            } else {
                res.json({"success": 0, "result": {"message": "오늘의 육아 보기 실패"}});
            }
        })
    }
});

//댓글리스트
router.get('/replyList', function(req,res) {
    var todaysCareNum  = req.query.todaysCareNum ;
    var start = req.query.start;
    var count = req.query.count;
    if(!todaysCareNum ) {
        res.json({"success": 0, "result": {"message": "글 번호 없음, 댓글 리스트 실패"}});
    } else if(!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 댓글 리스트 실패"}});
    } else if(!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 댓글 리스트 실패"}});
    } else {
        var datas = [start*1, count*1, todaysCareNum*1];
        db_todays.replyList(datas, function(data) {
            res.json({"success": 1, "result": {"message": "댓글 리스트 성공", "todaysReplyList":data}});
        })
    }
})

router.post('/reply', function(req, res) {
    var memberId = req.session.user_id;
    var todaysCareNum = req.body.todaysCareNum;
    var todayReplyContent = req.body.todayReplyContent;
    if(!memberId) {
        res.json({"success": 0, "result": {"message": "로그인 안됨, 오늘의 육아 댓글 실패"}});
    } else if(!todaysCareNum) {
        res.json({"success": 0, "result": {"message": "오늘의 육아 번호 없음, 오늘의 육아 댓글 실패"}});
    } else if(!todayReplyContent) {
        res.json({"success": 0, "result": {"message": "댓글 내용 없음, 오늘의 육아 댓글 실패"}});
    } else {
        var datas = [todaysCareNum, memberId, todayReplyContent];
        db_todays.reply(datas, function(success) {
            if (success) {
                res.json({"success": 1, "result": {"message": "오늘의 육아 댓글 성공"}});
            } else {
                res.json({"success": 0, "result": {"message": "오늘의 육아 댓글 실패"}});
            }
        })
    }
});

router.post('/delReply', function(req, res) {
    var memberId = req.session.user_id;
    var todayReplyNum = req.body.todayReplyNum;
    if(!memberId) {
        res.json({"success": 0, "result": {"message": "로그인 안됨, 오늘의 육아 댓글 삭제 실패"}});
    } else if(!todayReplyNum) {
        res.json({"success": 0, "result": {"message": "댓글 번호 없음, 오늘의 육아 댓글 삭제 실패"}});
    } else {
        var datas = [todayReplyNum, memberId];
        db_todays.delReply(datas, function(success) {
            if (success) {
                res.json({"success": 1, "result": {"message": "오늘의 육아 댓글 삭제 성공"}});
            } else {
                res.json({"success": 0, "result": {"message": "오늘의 육아 댓글 삭제 실패"}});
            }
        })
    }
})

router.post('/like', function(req, res) {
    var memberId = req.session.user_id;
    var todaysCareNum = req.body.todaysCareNum;
    var like_flag = req.body.isReaderLike;
    if(!memberId) {
        res.json({"success": 0, "result": {"message": "로그인 안됨, 오늘의 육아 좋아요 실패"}});
    } else if(!todaysCareNum) {
        res.json({"success": 0, "result": {"message": "오늘의 육아 번호 없음, 오늘의 육아 좋아요 실패"}});
    } else {
        var datas = [memberId, todaysCareNum*1, like_flag, like_flag];
        db_todays.like(datas, function(success) {
            if (success) {
                res.json({"success": 1, "result": {"message": "오늘의 육아 좋아요 성공"}});
            } else {
                res.json({"success": 0, "result": {"message": "오늘의 육아 좋아요 실패"}});
            }
        })
    }
})




module.exports = router;
