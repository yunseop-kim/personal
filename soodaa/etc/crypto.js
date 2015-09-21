var crypto = require('crypto');
var mysql = require('mysql');
var db_config = require('../models/db_config');
var logger = require('./logger');

var pool = mysql.createPool(db_config);


/************************************
 * 암호화
 * @param pass(inputpass)
 * @param done(err, passwd)
 ************************************/
exports.myCrypto = function (pass, done) {
    pool.getConnection(function (err, conn) {
        if(err){
            logger.error('err', err);
            done(err);
            return;
        }
        var sql1 = "select pathUrl salt from absolutePath where pathName ='salt' ";
        conn.query(sql1,[], function(err, salt) {
            if(err){
                logger.error('err', err);
                done(err);
                return;
            }
            var salt = salt[0].salt;
            var passwd = crypto.createHmac('sha256', salt).update(pass).digest('hex');
            conn.release();
            done(null, passwd);
        })

    })
}
