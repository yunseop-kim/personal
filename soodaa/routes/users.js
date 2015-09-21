var express = require('express');
var router = express.Router();
var facebook = require('../etc/facebook');
var logger = require('../etc/logger');
/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('index',{title:"test"});
});

router.post('/test', function(req, res, next) {
  var memberFbAccessToken = req.body.memberFbAccessToken;
  logger.debug('fb_login', memberFbAccessToken);
  facebook.fb_test(memberFbAccessToken, function (err, data) {
    if (err) {
      res.json({"result":"no"})

    } else {
      res.json({"result":data})
    }
  })});


module.exports = router;
