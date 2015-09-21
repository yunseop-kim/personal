var express = require('express');
var router = express.Router();
var gcm = require('../etc/gcm');
var db_gcm = require('../models/db_gcm');
var logger = require('../etc/logger');
var moment = require('moment');


router.post('/sendMessage', function (req, res) {
    if(req.session.user_id){
        var memberId = req.session.user_id;
        var receiver = req.body.targetId;
        var chatContent = req.body.messageContent;

        var datas = [memberId, receiver, chatContent];
        logger.debug('datas',datas);
        var messageDate = moment().format("YYYY-MM-DD HH:mm:ss");
        logger.debug('messagedate',messageDate)
        db_gcm.chat(datas, function (data) {
            if (data) {
                gcm.chat(data, function () {
                    res.json({"success": 1, "result": {"message": "쪽지 보내기 성공", "messageDate":messageDate}})
                })
            } else {
                res.json({"success": 0, "result": {"message": "쪽지 보내기 실패"}})
            }
        })
    } else {
        res.json({"success": 0, "result": {"message": "쪽지 보내기 실패"}})
    }
})


router.get('/getMessage', function (req, res) {
    if(req.session.user_id){
        var memberId = req.session.user_id;
        //var memberId = req.query.memberId;

        var datas = [memberId];
        logger.debug('getMessage membeId',memberId);

        db_gcm.getMessage(datas , function (data, success) {
            if (success==1) {
                logger.debug('success');
                res.json({"success": 1, "result": {"message": "메세지 얻기 성공", "data": data}});
            } else if(success==0) {
                res.json({"success": 0, "result": {"message": "메세지 얻기 실패"}})
            } else if(success==2){
                res.json({"success": 0, "result": {"message": "데이터 없음, 메세지 얻기 실패"}})

            }
        })
    } else {
        res.json({"success": 0, "result": {"message": "메세지 얻기 실패"}})
    }
})


router.get('/getReviewLike', function(req, res) {
    if(req.session.user_id){
        var memberId = req.session.user_id;

        var datas = [memberId];


        db_gcm.getReviewLike(datas, function (data, success) {
            if (success==1) {
                logger.debug('test')
                res.json({"success": 1, "result": {"message": "메세지 얻기 성공", "data": data}})
            } else if(success==0) {
                res.json({"success": 0, "result": {"message": "메세지 얻기 실패"}})
            } else if(success==2){
                res.json({"success": 0, "result": {"message": "데이터 없음, 메세지 얻기 실패"}})

            }
        })
    } else {
        res.json({"success": 0, "result": {"message": "메세지 얻기 실패"}})
    }
})



router.get('/getReviewReply', function(req, res) {
    if(req.session.user_id){
        var memberId = req.session.user_id;

        var datas = [memberId];


        db_gcm.getReviewReply(datas, function (data, success) {
            if (success==1) {
                res.json({"success": 1, "result": {"message": "메세지 얻기 성공", "data": data}})
            } else if(success==0) {
                res.json({"success": 0, "result": {"message": "메세지 얻기 실패"}})
            } else if(success==2){
                res.json({"success": 0, "result": {"message": "데이터 없음, 메세지 얻기 실패"}})

            }
        })
    } else {
        res.json({"success": 0, "result": {"message": "메세지 얻기 실패"}})
    }


})


router.get('/getChoiceReply', function(req, res) {
    if(req.session.user_id){
        var memberId = req.session.user_id;

        var datas = [memberId];


        db_gcm.getChoiceReply(datas, function (data, success) {
            if (success==1) {
                res.json({"success": 1, "result": {"message": "메세지 얻기 성공", "data": data}})
            } else if(success==0) {
                res.json({"success": 0, "result": {"message": "메세지 얻기 실패"}})
            } else if(success==2){
                res.json({"success": 0, "result": {"message": "데이터 없음, 메세지 얻기 실패"}})

            }
        })
    } else {
        res.json({"success": 0, "result": {"message": "메세지 얻기 실패"}})
    }


})


module.exports = router;
