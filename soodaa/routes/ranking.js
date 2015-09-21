var express = require('express');
var router = express.Router();
var async = require('async');
var db_rank = require('../models/db_rank');

router.get('/list', function (req, res) {
    var type = req.query.type;
    if (!type) {
        res.json({"success": 0, "result": {"message": "type 없음, 랭킹 실패"}});
    } else {
        db_rank.rankList(type*1, function (err, data) {
            if(err){
                res.json({"success": 0, "result": {"message": "랭킹 실패"}});
            } else {
                res.json({"success": 1, "result": {"message": "랭킹 성공", "data": data}});

            }

        })
    }


})


module.exports = router;
