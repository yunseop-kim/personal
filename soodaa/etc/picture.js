var easyimg = require('easyimage');
var path = require('path');
var fs = require('fs');
var async = require('async');
var logger = require('./logger');

var url = 'public/images/uploads/';


/****************************************
 * baby 파일 옮기기
 * @param file
 * @param done(err, result)
 ****************************************/
exports.baby = function(file, done) {
    var babyUrl = 'baby/baby_';
    var before = url + file;
    var after = url + babyUrl + file;
    fs.rename(before, after, function (err) {
        if (err) {
            logger.error('err',err);
            done(err);
        } else {
            var result = 'baby_' + file;
            done(null, result);
        }
    });
}

/****************************************
 * 초이스 파일 옮기기
 * @param file
 * @param done(err)
 ****************************************/
exports.choice = function(files, done) {
    var choiceUrl = 'choice/choice_';
    async.eachSeries(files, function (file, callback) {
        fs.rename(url + file, url + choiceUrl + file, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    }, function (err) {
        if (err) {
            logger.error('A file failed to process');
            done(err);
        } else {
            logger.debug('All files have been processed successfully');
            done(null);
        }
    });
}

/****************************************
 * 멤버 파일 옮기기
 * @param file
 * @param done(err)
 ****************************************/
exports.member = function(file, done) {
    fs.rename(url + file, url + 'member/member_' + file, function (err) {
        if (err) {
            logger.error('err',err);
            done(err);
        } else {
            done(null)
        }
    });
}

/****************************************
 * 리뷰 파일 옮기기
 * @param thumb
 * @param files
 * @param done(err)
 ****************************************/
exports.review = function(thumb, files, done) {
    async.waterfall([
        function(callback) {
            thumbnailFuc(thumb, files, callback);
        },
        function(files, callback) {
            logger.debug('files',files);
            async.eachSeries(files, function (file, callback) {
                fs.rename(url + file, url + 'review/review_' + file, function (err) {
                    if (err) {
                        logger.error('err',err);
                        callback(err)
                    } else {
                        callback(null);
                    }
                });
            }, function (err) {
                if (err) {
                    logger.error('A file failed to process');
                    callback(err);
                } else {
                    logger.debug('All files have been processed successfully');
                    callback(null);
                }
            });
        }
    ], function (err) {
        if(err){
            done(err);
        } else {
            done(null);
        }
    });
}


/****************************************
 * 오늘의 육아 파일 옮기기
 * @param thumb
 * @param files
 * @param done(err)
 ****************************************/
exports.todays = function(thumb, files, done) {
    async.waterfall([
        function(callback) {
            thumbnailFuc(thumb, files, callback);
        },
        function(files, callback) {
            logger.debug('files',files);
            async.eachSeries(files, function (file, callback) {
                fs.rename(url + file, url + 'todays/todays_' + file, function (err) {
                    if (err) {
                        logger.error('err',err);
                        callback(err)
                    } else {
                        callback(null);
                    }
                });
            }, function (err) {
                if (err) {
                    logger.error('A file failed to process');
                    callback(err);
                } else {
                    logger.debug('All files have been processed successfully');
                    callback(null);
                }
            });
        }
    ], function (err) {
        if(err){
            done(err);
        } else {
            done(null);
        }
    });
}


/****************************************
 * 이벤트 파일 옮기기
 * @param file
 * @param done(err)
 ****************************************/
exports.event = function(file, done) {
    var eventUrl = 'event/event_';
    var before = url + file;
    var after = url + eventUrl + file;
    fs.rename(before, after, function (err) {
        if (err) {
            logger.error('err',err);
            done(err);
        } else {
            var result = 'event_' + file;
            done(null, result);
        }
    });
}


/*******************************************
 * 썸네일 생성 함수
 * @param file : 썸네일 만들 파일
 * @param files : 파일 목록
 * @param callback(err, files)
 */
function thumbnailFuc(file, files, callback) {
    var name = file.name;
    var srcPath = file.path;
    var extension = file.extension;
    var idx = name.lastIndexOf('.');
    var prefixName = name.substring(0, idx);
    var destImg = prefixName + '-thumbnail.' + extension;
    //var destPath = './public/images/uploads/'+destImg;
    var destPath = path.join(__dirname, '..', 'public', 'images', 'uploads', destImg);
    easyimg.thumbnail({
        src: srcPath, dst: destPath,
        width: 128, height: 128,
        x: 0, y: 0
    }).then(function (file) {
        files.push(file.name);
        logger.debug('data', files);
        callback(null, files);
    }, function (err) {
        logger.error('err', err);
        callback(err, null);
    });
}
