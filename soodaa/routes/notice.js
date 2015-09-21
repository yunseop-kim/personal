var express = require('express');
var router = express.Router();
var db_notice = require('../models/db_notice')
var logger = require('../etc/logger');

//notice.js, 공지 리스트 불러오기

router.get('/list', function (req, res) {
    var start = req.query.start;
    var count = req.query.count;
    if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 공지사항 리스트 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 공지사항 리스트 실패"}});
    } else {
        var datas = [start*1, count*1];
        db_notice.list(datas, function(data){
            if(data){
                res.json({"success": 1, "result": {"message": "공지사항 리스트 성공", "noticeList":data}});
            } else {
                res.json({"success": 0, "result": {"message": "공지사항 리스트 실패"}});
            }
        })
    }
});

//공지사항 보기
router.get('/read', function (req, res) {
    var noticeNum = req.query.noticeNum;
    if (!noticeNum){
        res.json({"success": 0, "result": {"message": "공지사항 번호 없음, 공지사항 보기 실패"}});
    } else {
        db_notice.read(noticeNum, function(data) {
            if(data){
                res.json({"success": 1, "result": {"message": "공지사항 보기 성공", "data":data}});
            } else {
                res.json({"success": 0, "result": {"message": "공지사항 보기 실패"}});
            }
        })
    }
});

//쓰기
router.post('/write', function(req, res){
    var memberId = req.session.user_id;
    var noticeContent = req.body.noticeContent;
    if(!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 공지사항 쓰기 실패"}});
    } else if(memberId!='soodaa') {
        res.json({"success": 0, "result": {"message": "관리자 아님, 공지사항 쓰기 실패"}});
    } else if(!noticeContent) {
        res.json({"success": 0, "result": {"message": "공지사항 내용 없음, 공지사항 쓰기 실패"}});
    } else {
        var datas = [memberId, noticeContent];
        db_notice.write(datas, function(success){
            if (success) {
                res.json({"success": 1, "result": {"message": "공지사항 쓰기 성공"}});
            } else {
                res.json({"success": 0, "result": {"message": "공지사항 쓰기 실패"}});
            }
        })
    }
});


//관리자
router.post('/modify/', function (req, res) {
    var memberId = req.session.user_id;
    var noticeNum = req.body.noticeNum;
    var noticeContent = req.body.noticeContent;

    if(!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 공지사항 수정 실패"}});
    } else if(memberId!='soodaa') {
        res.json({"success": 0, "result": {"message": "관리자 아님, 공지사항 수정 실패"}});
    } else if(!noticeNum) {
        res.json({"success": 0, "result": {"message": "공지사항 번호 없음, 공지사항 수정 실패"}});
    } else if(!noticeContent) {
        res.json({"success": 0, "result": {"message": "공지사항 내용 없음, 공지사항 수정 실패"}});
    } else {
        var datas = [noticeContent, noticeNum];
        db_notice.modify(datas, function(success){
            if (success) {
                res.json({"success": 1, "result": {"message": "공지사항 수정 성공"}});
            } else {
                res.json({"success": 0, "result": {"message": "공지사항 수정 실패"}});
            }
        })
    }
});
//관리자
router.post('/delete/', function (req, res) {
    var memberId = req.session.user_id;
    var noticeNum = req.body.noticeNum;
    if(!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 공지사항 수정 실패"}});
    } else if(memberId!='soodaa') {
        res.json({"success": 0, "result": {"message": "관리자 아님, 공지사항 수정 실패"}});
    } else if(!noticeNum) {
        res.json({"success": 0, "result": {"message": "공지사항 번호 없음, 공지사항 수정 실패"}});
    } else {
        db_notice.delete(noticeNum,function(success) {
            if (success) {
                res.json({"success": 1, "result": {"message": "공지사항 수정 성공"}});
            } else {
                res.json({"success": 0, "result": {"message": "공지사항 수정 실패"}});
            }
        })
    }
});

module.exports = router;
