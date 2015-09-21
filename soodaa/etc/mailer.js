var nodemailer = require('nodemailer');
var mailer_config = require('./mailer_config');
var transporter = nodemailer.createTransport(mailer_config);
var logger = require('./logger');


/**********************************
 * 비밀번호 찾기 메일 보내기
 * @param data
 * data = [passwdnumber, memberId]
 * @paran done(error)
 *********************************/
exports.mailsend = function(data, done){
    var findnum = data[0];
    var id = data[1];
    var mailOptions = {
        from: 'SooDaa HelpDesk<soodaahelpdesk@gmail.com>', // sender address
        to: id, // list of receivers
        subject: '비밀번호찾기', // Subject line
        text: 'Hello world! ', // plaintext body
        html: '<b><table><tr><td>비밀번호를 변경하려면 아래링크를 클릭하세요</td></tr><tr><td>' +
        '<a href="http://52.68.92.194:3000/member/passwdfind/'+findnum+'">링크로 가기!</a></td></tr></table></b>' // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            logger.error('err',error);
            done(error);
        } else {
            logger.debug('Message sent: ' + info.response);
            logger.debug('info', info);
            done(null);
        }
    });
};
