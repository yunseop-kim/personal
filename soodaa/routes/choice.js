var express = require('express');
var router = express.Router();
var async = require('async');

var db_choice = require('../models/db_choice');
var picture = require('../etc/picture');
var gcm = require('../etc/gcm');
var logger = require('../etc/logger');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//초이스 리스트
router.get('/list', function (req, res, next) {
    var start = req.query.start;
    var count = req.query.count;
    var arrange = req.query.arrange;
    var memberId = req.session.user_id;

    if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 초이스 리스트 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 초이스 리스트 실패"}});
    } else if (!arrange) {
        res.json({"success": 0, "result": {"message": "옵션 없음, 초이스 리스트 실패"}});
    } else {
        var datas = [start*1, count*1, arrange*1, memberId];
        db_choice.list(datas, function(err, message, done){
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                res.json({"success": 1, "result": {"message": message, "choiceList" : done}});
            }
        });
    }
});
//카테고리 별로 리스트 뽑기 추가해야됨

//초이스 쓰기
router.post('/write', function (req, res, next) {
    var memberId = req.session.user_id;
    var voteTitle = req.body.voteTitle;
    var voteCategory = req.body.voteCategory;
    var voteFinalDate = req.body.voteFinalDate;
    var voteContent1 = req.body.voteContent1;
    var voteContent2 = req.body.voteContent2;
    var voteContent3 = req.body.voteContent3;
    var voteContent4 = req.body.voteContent4;
    var files = [];
    if(req.files.votePicture1) {
        var votePicture1 = 'choice_'+req.files.votePicture1.name;
        files.push(req.files.votePicture1.name)
    }
    if(req.files.votePicture2) {
        var votePicture2 = 'choice_'+req.files.votePicture2.name;
        files.push(req.files.votePicture2.name)
    }
    if(req.files.votePicture3){
        var votePicture3 = 'choice_'+req.files.votePicture3.name;
        files.push(req.files.votePicture3.name);
    }
    if(req.files.votePicture4){
        var votePicture4 = 'choice_'+req.files.votePicture4.name;
        files.push(req.files.votePicture4.name);
    }
    if (!voteTitle) {
        res.json({"success": 0, "result": {"message": "제목 없음, 초이스 쓰기 실패"}});
    } else if (!voteCategory) {
        res.json({"success": 0, "result": {"message": "카테고리 없음, 초이스 쓰기 실패"}});
    } else if (!voteFinalDate) {
        res.json({"success": 0, "result": {"message": "마감시간 없음, 초이스 쓰기 실패"}});
    } else if (!voteContent1) {
        res.json({"success": 0, "result": {"message": "항목1 없음, 초이스 쓰기 실패"}});
    } else if (!voteContent2) {
        res.json({"success": 0, "result": {"message": "항목2 없음, 초이스 쓰기 실패"}});
    } else {
        async.waterfall([
            function(callback){
                picture.choice(files, function(err){
                    if(err){
                        callback(err);
                    } else {
                        callback(null);
                    }
                })
            },
            function(callback){
                var datas = [memberId, voteContent1, voteContent2, voteContent3, voteContent4, voteTitle, voteCategory,
                    voteFinalDate , votePicture1, votePicture2, votePicture3, votePicture4];
                db_choice.write(datas, function(err, message, success){
                    if(err) {
                        callback(err, message);
                    } else {
                        if (success) {
                            callback(null, message)

                        } else {
                            callback('error', message);
                        }
                    }
                })

            }
        ], function(err, message){
            if(err){
                res.json({"success": 0, "result": {"message": message}});
            } else {
                res.json({"success": 1, "result": {"message": message}});
            }
        })

    }
});

//초이스 읽기
router.get('/read', function (req, res, next) {
    var memberId = req.session.user_id;
    var voteNum = req.query.voteNum;
    if (voteNum == '') {
        res.json({"success": 0, "result": {"message": "투표 번호 없음, 초이스 읽기 실패"}});
    } else {
        var datas = [memberId, voteNum, voteNum];
        db_choice.read(datas, function(err, message, data){
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if (data) {
                    res.json({"success": 1, "result": {"message": message, "choiceReadData":data}});
                } else {
                    res.json({"success": 0, "result": {"message": "초이스 보기 실패"}});
                }
            }
        });
    }
});

//투표결과 보기
router.get('/readResult', function(req, res, next){
    var voteNum = req.query.voteNum;
   if (voteNum == '') {
          res.json({"success": 0, "result": {"message": "투표 번호 없음, 초이스 결과 보기 실패"}});
      } else {
          var datas = [voteNum];
          db_choice.readResult(datas, function(err, message, data){
              if(err) {
                  res.json({"success": 0, "result": {"message": message}});
              } else {
                  if (data) {
                      res.json({
                          "success": 1,
                          "result":
                          {
                              "message": message,
                              "choiceResultData":data
                          }
                      });
                  } else {
                      res.json({"success": 0, "result": {"message": "초이스 결과 보기 실패"}});
                  }
              }

          });
      }
});


//초이스 삭제
router.post('/delete', function (req, res, next) {
    var memberId = req.session.user_id;
    // var memberId = req.query.memberId;
    var voteNum = req.query.voteNum;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 초이스 삭제 실패"}});
    } else if (voteNum == '') {
        res.json({"success": 0, "result": {"message": "투표 번호 없음, 초이스 삭제 실패"}});
    } else {
        var datas = [memberId, voteNum];
        db_choice.delete(datas, function(err, message, success){
            if(err) {
                res.json({"success": 1, "result": {"message": message}});
            } else {
                if(success){
                    res.json({"success": 1, "result": {"message": message}});
                }else{
                    res.json({"success": 1, "result": {"message": message}});
                }
            }

        });
    }
});

//초이스 댓글쓰기
router.post('/reply', function (req, res, next) {
    var memberId = req.session.user_id;
    var voteNum  = req.body.voteNum;
    var voteReplyContent  = req.body.voteReplyContent;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "작성자 아이디 없음, 초이스 댓글 쓰기 실패"}});
    } else if (!voteNum) {
        res.json({"success": 0, "result": {"message": "투표글 인덱스 없음, 초이스 댓글 쓰기 실패"}});
    } else if (!voteReplyContent) {
        res.json({"success": 0, "result": {"message": "댓글 내용 없음, 초이스 댓글 쓰기 실패"}});
    } else {
        var datas = [voteNum, memberId, voteReplyContent];
        db_choice.reply(datas, function(err, message, success){
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if (success) {
                    var data = [voteNum, memberId];
                    gcm.choice(data, function(){
                        res.json({"success": 1, "result": {"message": message}});
                    })
                } else {
                    res.json({"success": 0, "result": {"message": message}});
                }
            }
        });
    }
});

//투표하기
router.post('/vote', function (req, res, next) {
    var voteNum = req.body.voteNum;
     var memberId = req.session.user_id;
    //var memberId = req.body.memberId;
    var voteContentNum  = req.body.voteContentNum ;
    if (voteNum == '') {
        res.json({"success": 0, "result": {"message": "투표 번호 없음, 투표 하기 실패"}});
    } else if (memberId == '') {
        res.json({"success": 0, "result": {"message": "아이디 없음, 투표 하기 실패"}});
    } else if (voteContentNum  == '') {
        res.json({"success": 0, "result": {"message": "항목 번호 없음, 투표 하기 실패"}});
    } else {
        var datas = [ memberId, voteNum, voteContentNum, voteContentNum  ];
        db_choice.vote(datas, function(err, message, success){
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if(success){
                    if (voteContentNum  == 1) {
                        res.json({"success": 1, "result": {"message": "1번 투표 하기 성공"}});
                    } else if (voteContentNum  == 2) {
                        res.json({"success": 1, "result": {"message": "2번 투표 하기 성공"}});
                    } else if (voteContentNum  == 3) {
                        res.json({"success": 1, "result": {"message": "3번 투표 하기 성공"}});
                    } else if (voteContentNum  == 4) {
                        res.json({"success": 1, "result": {"message": "4번 투표 하기 성공"}});
                    } else {
                        res.json({"success": 1, "result": {"message": "잘못된 투표 번호가 입력됨!!"}});
                    }
                }else{
                    res.json({"success": 0, "result": {"message": message}});
                }
            }

        });

    }
});

//초이스 댓글 리스트
router.get('/replyList', function (req, res, next) {
    var voteNum = req.query.voteNum;
    var start = req.query.start;
    var count = req.query.count;
    if (voteNum=='') {
        res.json({"success": 0, "result": {"message": "원글 인덱스 번호 없음, 초이스 리스트 실패"}});
    } else if (!start) {
        res.json({"success": 0, "result": {"message": "페이지 없음, 초이스 리스트 실패"}});
    } else if (!count) {
        res.json({"success": 0, "result": {"message": "갯수 없음, 초이스 리스트 실패"}});
    } else {
        var datas = [start, count, voteNum];
        db_choice.replyList(datas, function(err, message, data){
            if(err) {
                res.json({"success": 0, "result": {"message": message}});
            } else {
                if(data){
                    res.json({"success" : 1, "result" : {"message" : message,"choiceList" : data }});
                }else{
                    res.json({"success": 0, "result": {"message": "초이스 댓글 리스트 실패"}});
                }
            }

        });
    }
});

//초이스 댓글 삭제
router.post('/delReply', function (req, res, next) {
    // var memberId = req.session.user_id;
    var memberId = req.body.memberId;
    var voteReplyNum = req.body.voteReplyNum;
    if (!memberId) {
        res.json({"success": 0, "result": {"message": "세션 아이디 없음, 초이스 댓글 삭제 실패"}});
    } else if (voteReplyNum == '') {
        res.json({"success": 0, "result": {"message": "투표 번호 없음, 초이스 댓글 삭제 실패"}});
    } else {
        var datas = [memberId, voteReplyNum];
        db_choice.delReply(datas, function(err, message, success){
            if(err) {
                res.json({"success": 1, "result": {"message": message}});
            } else {
                if(success){
                    res.json({"success": 1, "result": {"message": message}});
                }else{
                    res.json({"success": 1, "result": {"message": message}});
                }
            }

        });
    }
});

module.exports = router;