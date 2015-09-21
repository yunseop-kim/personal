var graph = require('fbgraph');
var logger = require('./logger');
var fb_config = require('./fb_config');


/**************************************
 * 페이스북 인증 URL 얻는 함수
 * @param done(authUrl)
 **************************************/
exports.getUrl = function (done) {
    var authUrl = graph.getOauthUrl({
        "client_id": fb_config.client_id
        , "redirect_uri": fb_config.redirect_uri
        , "scope": fb_config.scope
    });
    done(authUrl);

}

/**************************************
 * 웹 페이스북 로그인
 * @param code(code)
 * @param done(err, res, token)
 **************************************/
exports.fb_login = function (code, done) {
    logger.debug('code',code);
    graph.authorize({
        "client_id": fb_config.client_id
        , "redirect_uri": fb_config.redirect_uri
        , "client_secret": fb_config.client_secret
        , "code": code
    }, function (err, facebookRes) {
        if (err) {
            logger.error('err', err);
            done(err)
        } else {
            console.log('test', facebookRes);
            console.log('test', facebookRes.access_token);
            var token = facebookRes.access_token;
            graph.get("me", function (err, res) {
                logger.debug('res', res);
                done(null, res, token)

            });
        }
    });
}


/**************************************
 * 모바일 페이스북 로그인
 * @param token(token)
 * @param done(err, datas)
 * datas = [memberId, gender, memberName, memberOption, memberEmail]
 * 이슈 : 이메일을 못 받아옴?
 **************************************/
exports.fb_mlogin = function (token, done) {
    graph.setAccessToken(token);

    graph.get("me", function (err, res) {
        if (err) {
            logger.error('err', err);
            done(err)
        } else {
            logger.debug('me', res);
            var memberId = res.id;
            var memberEmail = res.email;
            if (res.gender == 'male') {
                var gender = 1;
                var memberOption = 1;
            } else {
                var gender = 2;
                var memberOption = 2;
            }
            var memberName = res.name;
            var datas = [memberId, gender, memberName, memberOption, memberEmail];
            logger.debug('res', res);
            done(null, datas)
        }
    });
}



exports.fb_test = function (token, done) {
    //graph.setAccessToken(token);

    graph.extendAccessToken({
        "access_token":    token
        , "client_id":      fb_config.client_id
        , "client_secret":  fb_config.client_secret
        , "scope": fb_config.scope

    }, function (err, facebookRes) {
        console.log(facebookRes);
        //done(null, facebookRes);
        graph.setAccessToken(facebookRes.access_token);

        graph.get("me?fields=id,name,email", function(err, res){
            console.log(res);
            done(null,res);
        })
    });
}
