var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');
var async = require('async');
var db_gcm = require('../models/db_gcm');
var logger = require('./logger');

var key = 'AIzaSyAiOgqHB4v7S11Felwlu9RIa-awNzytZRA';  //Server API key


/***************************************
 * GCM TYPE : {
 *  1 : 채팅
 *  2 : 리뷰 좋아요
 *  3 : 리뷰 댓글
 *  4 : 초이스 댓글
 *  }
 **************************************/



/**************************************
 * 채팅 GCM (type : 1)
 * @param data
 * data = [regId, memberName]
 * @param done(err, result)
 **************************************/
exports.chat = function (data, done) {
    var regIds = [];

    var message = new gcm.Message();
    var sender = new gcm.Sender(key);  //Server API key
    regIds.push(data.regId);
    message.addData({
        'type': "1"
    });

    sender.send(message, regIds, function (err, result) {
        if (err) logger.error('err', err);
        else {
            logger.debug('result', result);
            done(err, result);
        }
    })
}


/**************************************
 * 리뷰 좋아요 GCM (type : 2)
 * @param data(memberId)
 * @param done(err)
 * db_gcm.review : registrationId 얻어오는 함수
 **************************************/
exports.reviewLike = function (data, done) {
    var regIds = [];
    async.waterfall([
        function(callback){
            db_gcm.review([data], function(err, data){
                if(err){
                    callback(err)
                } else {
                    logger.debug('data',data);
                    callback(null, data);
                }
            })
        },
        function(data, callback){
            if(data){
                var message = new gcm.Message();
                var sender = new gcm.Sender(key);  //Server API key
                regIds.push(data);
                message.addData({
                    'type': "2"
                });
                sender.send(message, regIds, function (err, result) {
                    if (err) {
                        logger.error('err', err);
                        callback(err);
                    } else {
                        logger.debug('result', result);
                        callback(null);
                    }
                })
            } else {
                callback(null);
            }
        }

    ], function(err){
        if(err){
            done(err);
        } else {
            done(null);
        }
    })
}



/**************************************
 * 리뷰 댓글 GCM (type : 3)
 * @param data(memberId)
 * @param done(err)
 * db_gcm.review : registrationId 얻어오는 함수
 **************************************/
exports.reviewReply = function (data, done) {
    var regIds = [];
    async.waterfall([
        function(callback){
            db_gcm.review([data], function(err, data){
                if(err){
                    callback(err)
                } else {
                    logger.debug('data',data);
                    callback(null, data);
                }
            })
        },
        function(data, callback){
            if(data){
                var message = new gcm.Message();
                var sender = new gcm.Sender(key);  //Server API key
                regIds.push(data);
                message.addData({
                    'type': "3"
                });
                sender.send(message, regIds, function (err, result) {
                    if (err) {
                        logger.error('err', err);
                        callback(err);
                    } else {
                        logger.debug('result', result);
                        callback(null);
                    }
                })
            } else {
                callback(null);
            }
        }

    ], function(err){
        if(err){
            done(err);
        } else {
            done(null);
        }
    })
}


/**************************************
 * 초이스 댓글 GCM (type : 4)
 * @param data(memberId)
 * @param done(err)
 * db_gcm.choice : registrationId 얻어오는 함수
 **************************************/
exports.choice = function (data, done) {
    var regIds = [];
    async.waterfall([
        function(callback){
            db_gcm.choice(data[0], function(err, data){
                if(err){
                    callback(err)
                } else {
                    logger.debug('data',data);
                    callback(null, data);
                }
            })
        },
        function(data, callback){
            if(data){
                var message = new gcm.Message();
                var sender = new gcm.Sender(key);  //Server API key
                regIds.push(data);
                message.addData({ //초이스 댓글
                    'type': "4"
                });
                sender.send(message, regIds, function (err, result) {
                    if (err) {
                        logger.error('err', err);
                        callback(err);
                    } else {
                        logger.debug('result', result);
                        callback(null);
                    }
                })
            } else {
                callback(null);
            }
        }
    ], function(err){
        if(err){
            done(err);
        } else {
            done(null);
        }
    })
}



