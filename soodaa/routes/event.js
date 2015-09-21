var express = require('express');
var router = express.Router();
var async = require('async');

var picture = require('../etc/picture');
var logger = require('../etc/logger');
var db_event = require('../models/db_event');

/* GET home page. */
router.post('/addEvent', function(req, res){
    var eventPicture;
    async.waterfall([
        function(callback){
            if(req.files.eventPicture){
                picture.event(req.files.eventPicture.name, function(err, data){
                    if(err){
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
        function(callback) {
            var datas = [eventPicture];
            db_event.addEvent(datas, function(err, success){
                if(err) {
                    callback(err);
                } else {
                    if(success){
                        callback(null);
                    } else {
                        callback('error');
                    }
                }
            })
        }
    ], function(err) {
        if(err) {
            res.json({"ok":"no"})
        } else {
            res.json({"ok":"ok"})
        }
    })
})

router.get('/getEvent', function(req, res){
    db_event.getEvent(function(err, data){
        if(err) {
            res.json({"success":0})
        } else {
            res.json({"success":1, "result": data})
        }
    })
})

module.exports = router;
