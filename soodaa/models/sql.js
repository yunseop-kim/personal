// sql.js

//db_web.js의 index
exports.myInform =
"select m.memberId, m.memberEmail, m.memberName, m.memberGender, m.memberPicture, DATE_FORMAT(m.memberBirth, '%Y-%m-%d') memberBirth, " +
"DATE_FORMAT(m.memberRegdate, '%Y-%m-%d %H:%i:%s') memberRegdate, sum(r.reviewHit) totalHits, count(r.reviewNum) totalReviews, " +
"sum((select count(1) from like_flag lf where lf.reviewNum = r.reviewNum and lf.like_flag = 1)) totalLikes " +
"from review r , member m " +
"where r.memberId=m.memberId and r.memberId=?"

exports.reviewCnt = "select count(1) cnt from review where reviewIsDeleted=0";

exports.reviewPaging =
"select reviewNum, productName, memberId, memberName, productBrand, reviewStar, likeFlagCnt, reviewReplyCnt, reviewHit, reviewThumbnail " +
"from reviewListView where reviewIsDeleted=0 order by reviewRegdate desc limit ?,?";

//login
exports.login = "select count(1) cnt from member where memberId=? and memberPasswd=? and memberWithdraw='N'";
exports.fbLogin = "select count(1) cnt from member where memberId=? and memberWithdraw='N'";
exports.fbInsert = "insert into member (memberFbAccessToken, memberId, memberGender, memberName, memberOption, memberEmail) values(?,?,?,?,?,?) ";
exports.fbInsert2 = "insert into member (memberFbAccessToken, memberId, memberGender, memberName, memberGCMRegId, memberOption, memberEmail) values(?,?,?,?,?,?,?) ";

//baby
exports.baby = "select babyBirth from baby where memberId=? and babyIsChecked=1";

//list
exports.listWithKeyword = function (keyword, callback){
	var sql_cnt = "select count(1) cnt from reviewListView where reviewIsDeleted=0 and instr(productName, '"+ keyword +"') > 0 or instr(productBrand, '" + keyword + "') > 0 or instr(productCategory2, '"+ keyword + "') > 0";

	var sql_list = "select reviewNum, productName, memberId, memberName, productBrand, likeFlagCnt, reviewReplyCnt, reviewHit, " +
	"reviewThumbnail from reviewListView where reviewIsDeleted=0 and ( instr(productName, '"+ keyword +"') > 0 or instr(productBrand, '" + keyword + "') > 0 or instr(productCategory2, '"+ keyword + "') > 0 ) order by reviewRegdate desc limit ?,?";

	callback(sql_cnt, sql_list);
}

//mypage, myInform 활용
exports.myReviews = "select reviewNum, productName, memberName, memberId, productBrand, likeFlagCnt, reviewReplyCnt, reviewHit, reviewThumbnail from reviewListView where memberId=? and reviewIsDeleted=0 order by reviewRegdate";

exports.modifyMyPage = "update member set memberName=?, memberBirth=?, memberGender=? where memberId=?";

exports.modifyMyPic = "update member set memberPicture=? where memberId=?";

//reviewRead
exports.updateHits = "update review set reviewHit = reviewHit + 1 where reviewNum = ?";

exports.readReview = "select memberId, reviewNum, productBrand, productName, reviewStar, reviewPrice, reviewWhere, reviewGood, reviewBad, reviewKnowhow, reviewRecommandPeople, reviewContent, reviewPicture1, reviewPicture2, reviewPicture3, reviewPicture4, reviewPicture5, likeFlagCnt, reviewReplyCnt, reviewHit from reviewListView where reviewNum=?";

exports.likeCnt = "select count(1) isReaderLike from like_flag where like_flag=1 and reviewNum=? and memberId=?";

exports.getReplies = "select rr.memberId, rr.reviewReplyNum, mem.memberPicture, mem.memberName,  DATE_FORMAT(rr.reviewReplyRegdate, '%Y-%m-%d %H:%i:%s') reviewReplyRegdate, rr.reviewReplyContent from rev_reply rr, member mem where rr.reviewNum=? and rr.reviewReplyIsDeleted=0 and rr.memberId = mem.memberId order by reviewReplyRegdate desc";

//delReview
exports.delReview = "UPDATE review SET reviewIsDeleted=1 where reviewNum=? and memberId=?";

//like
exports.like = "INSERT INTO like_flag (memberId, reviewNum, like_flag) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE like_flag = ?";
exports.getReceiver = "select memberId from review where reviewNum=?";
exports.likeGCM = "insert into gcm (senderId,receiverId, tmpIndex, type) values(?,?,?,2)";
exports.delLikeGCM = "delete from gcm where senderId=? and tmpIndex=?";

//reply
exports.reply = "INSERT INTO rev_reply (reviewNum, memberId, reviewReplyContent) VALUES (?, ?, ?);";
exports.replyGCM = "insert into gcm (senderId, receiverId, tmpIndex, type) values(?,?,?,3)";
exports.delReply = "UPDATE rev_reply SET reviewReplyIsDeleted=1 WHERE reviewReplyNum=? and memberId=?";

//productSearch
exports.productSearch = function (productName, callback){
	var sql = "select productNum, productBrand, productName from product where instr(productCategory1, '" + productName + "' )>0 or instr(productCategory2, '" + productName + "' )>0 or instr(productBrand, '" + productName + "') > 0 or instr(productName, '" + productName + "') > 0 order by productNum desc";

	callback(sql);
}

//join , fblogin 활용
exports.join = "insert into member(memberId, memberPasswd, memberName, memberBirth, memberOption, memberGender, memberRegdate) values(?,?,?,?,?,?,now())";

exports.getProduct = "select productNum, productBrand, productName from product where productNum=?";

exports.reviewWrite =
	"INSERT INTO review (productNum, memberId, reviewContent, reviewWhere, reviewPrice, " +
	"reviewKnowhow, reviewGood, reviewBad, reviewRecommandPeople, reviewStar, reviewThumbnail, reviewPicture1, reviewPicture2, " +
	"reviewPicture3, reviewPicture4, reviewPicture5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

exports.productWrite = "INSERT INTO product (productCategory1, productBrand, productName) VALUES (?, ?, ?)";

//reviewSearch : 기존 listwithkeyword, listcntwithkeyword 활용

exports.getReview = "select memberId, reviewNum, productNum, productBrand, productName, reviewWhere, reviewKnowhow, reviewStar, reviewPrice, reviewGood, reviewBad, reviewRecommandPeople, reviewContent from reviewListView where reviewNum=?";

exports.modifyReview = "update review set productNum=?, reviewContent=?, reviewWhere=?, reviewPrice=?, reviewGood=?, reviewBad=?, reviewRecommandPeople=?, reviewKnowhow=?, reviewStar=? where memberId=? and reviewNum=?";

/***********************************************************/

//db_admin.js

exports.adminLogin = "select count(1) cnt from member where memberId=? and memberPasswd=? and memberLevel=99 and memberWithdraw='N'";

exports.todaysListCnt = "select count(1) cnt from todaysListView";

exports.todaysList =
								"select todaysCareNum, todaysCareTitle, todaysCareContent," +
                "DATE_FORMAT(todaysCareRegdate, '%Y-%m-%d %H:%i:%s') regdate, todaysCareHit " +
                "from todaysListView order by todaysCareNum desc limit ?, ?"

exports.todaysWrite = "INSERT INTO todays (memberId, todaysCareTitle, todaysCareContent,todaysCareThumbnail, " +
            "todaysCarePicture1, todaysCarePicture2, todaysCarePicture3, todaysCarePicture4, todaysCarePicture5," +
            "todaysCarePicture6, todaysCarePicture7, todaysCarePicture8, todaysCarePicture9, todaysCarePicture10, " +
            "todaysCareCategory) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

exports.todaysRead =
"select todaysCareNum, memberName, DATE_FORMAT(todaysCareRegdate, '%Y-%m-%d %H:%i:%s') todaysCareRegdate, todaysCareLikeCnt, todaysCareHit," +
" todaysCareTitle, todaysCareContent, todaysCareCategory, todaysCareIsDeleted, todaysCarePicture1,todaysCarePicture2,todaysCarePicture3," +
"todaysCarePicture4,todaysCarePicture5, todaysCarePicture6,todaysCarePicture7,todaysCarePicture8," +
"todaysCarePicture9,todaysCarePicture10, todaysCareHit, todaysCareLikeCnt, todaysCareReplyCnt" +
" from todaysListView where todaysCareNum=?";

exports.todaysReply = "select todayReplyNum, todaysCareNum, memberId, todayReplyContent, DATE_FORMAT(todayReplyRegdate, '%Y-%m-%d %H:%i:%s') todayReplyRegdate, todayReplyIsDeleted from todayReply where todaysCareNum=?"

exports.selectTodaysModify =
						"select todaysCareNum, memberName, DATE_FORMAT(todaysCareRegdate, '%Y-%m-%d %H:%i:%s') todaysCareRegda," +
            " todaysCareTitle, todaysCareContent, todaysCarePicture1,todaysCarePicture2,todaysCarePicture3," +
            "todaysCarePicture4,todaysCarePicture5, todaysCarePicture6,todaysCarePicture7,todaysCarePicture8," +
            "todaysCarePicture9,todaysCarePicture10, todaysCareCategory from todaysListView where todaysCareNum=?";

exports.todaysModify = "UPDATE todays set todaysCareModifydate=now(), todaysCareTitle=?, todaysCareContent=?, todaysCareCategory=? where todaysCareNum=?";

exports.todaysDelete = "UPDATE todays set todaysCareIsDeleted=1 where todaysCareNum=?";

exports.noticeListCnt = "select count(*) cnt from notice";

exports.noticeList = "select noticeNum, memberId, noticeContent, DATE_FORMAT(noticeRegdate, '%Y-%m-%d %H:%i:%s') regdate from notice order by noticeNum desc limit ?, ?";

exports.noticeWrite = "INSERT INTO notice (memberId, noticeContent) VALUES (?, ?)";

exports.noticeRead = "select noticeNum, memberId, noticeContent, DATE_FORMAT(noticeRegdate, '%Y-%m-%d %H:%i:%s') noticeRegdate, noticeIsDeleted from notice where noticeNum=?";

exports.noticeModifyform = "select noticeNum, memberId, noticeContent from notice where noticeNum=? ";

exports.noticeModify = "update notice set noticeContent=?, noticeModifydate=now() where noticeNum=?"

exports.noticeDelete = "update notice set noticeIsDeleted=1 where noticeNum=?"

exports.productListCnt = "select count(*) cnt from product";

exports.productList = "select productNum, productBrand, productCategory1, productCategory2, productName," +
                "productStartAge, productEndAge, DATE_FORMAT(productRegdate, '%Y-%m-%d %H:%i:%s') productRegdate " +
                "from product order by productNum desc limit ?, ?";

exports.productWrite_admin = "insert into product (productBrand, productCategory1, productCategory2, productName, " +
            "productStartAge, productEndAge) values (?,?,?,?,?,?) "

exports.productModifyform = "select productNum, productBrand, productCategory1, productCategory2, productName," +
            "productStartAge, productEndAge, DATE_FORMAT(productRegdate, '%Y-%m-%d %H:%i:%s') productRegdate " +
            "from product where productNum=?";

exports.productModify = "update product set productBrand=?, productCategory1=?, productCategory2=?, " +
            "productName=?, productStartAge=?, productEndAge=? where productNum=?"

exports.productDelete = "delete from product where productNum=?"

exports.admin_productSearch = function ( switchNum , keyword, callback ){
	var sql1 = "";
	var sql2 = "";

	switch (switchNum){
	    case 1 :
	        sql1 = "select count(1) cnt from product where instr(productBrand,'"+keyword+"' )>0";
	        sql2 = "select productNum, productBrand, productCategory1, productCategory2, productName," +
	            "productStartAge, productEndAge, DATE_FORMAT(productRegdate, '%Y-%m-%d %H:%i:%s') productRegdate " +
	            " from product where instr(productBrand,'"+keyword+"' )>0 order by productNum desc limit ?, ? ";
	        break;
	    case 2 :
	        sql1 = "select count(1) cnt from product where instr(productCategory1, '"+keyword+"' )>0 " +
	            "or instr(productCategory2, '"+keyword+"' )>0";
	        sql2 = "select productNum, productBrand, productCategory1, productCategory2, " +
	            "productName, productStartAge, productEndAge, " +
	            "DATE_FORMAT(productRegdate, '%Y-%m-%d %H:%i:%s') productRegdate " +
	            "from product where instr(productCategory1, '"+keyword+"' )>0 or " +
	            "instr(productCategory2, '"+keyword+"' )>0  order by productNum desc limit ?,?";
	        break;
	    case 3 :
	        sql1 = "select count(1) cnt from product where instr(productName, '"+keyword+"' )>0";
	        sql2 = "select productNum, productBrand, productCategory1, productCategory2, productName, " +
	            "productStartAge, productEndAge, DATE_FORMAT(productRegdate, '%Y-%m-%d %H:%i:%s') productRegdate " +
	            "from product where instr(productName, '"+keyword+"' )>0 order by productNum desc limit ?, ? ";
	        break;
	}

	callback(sql1, sql2);
}

exports.reportListCnt = "select count(1) cnt from reportFlag";

exports.reportList =
            "select rf.reportFlag, rf.memberId, rf.reviewNum, rf.reportContent, DATE_FORMAT(rf.reportDate, '%Y-%m-%d %H:%i:%s') reportDate, "+
            "r.memberId as reported from reportFlag rf, review r where rf.reviewNum = r.reviewNum order by reportDate desc limit ?, ?";

exports.reportComplete = "update reportFlag set reportFlag=0 where memberId=? and reviewNum=?";

exports.memberListCnt1 = "select count(1) cnt from member where instr(memberId, ?) > 0";

exports.memberListCnt2 = "select count(1) cnt from member where instr(memberName, ?) > 0";

exports.memberList1 =
            "select memberId, memberEmail, memberName, DATE_FORMAT(memberRegdate, '%Y-%m-%d %H:%i:%s') " +
            "memberRegdate, memberLevel, memberGender, memberPicture, memberWithdraw from member where instr(memberId, ?) > 0 order by memberRegdate desc limit ?, ?";

exports.memberList2 =
	"select memberId, memberEmail, memberName, DATE_FORMAT(memberRegdate, '%Y-%m-%d %H:%i:%s') " +
	"memberRegdate, memberLevel, memberGender, memberPicture, memberWithdraw from member where instr(memberName, ?) > 0 order by memberRegdate desc limit ?, ?";

exports.regblack = "update member set memberWithdraw='B' where memberId=?";

exports.releaseblack = "update member set memberWithdraw='N' where memberId=?";

exports.memberRead1 = "select memberId, memberPicture, memberName, memberLevel, memberExp, memberWithdraw from member where memberId=?";
exports.memberRead2 =  "select sum(reviewHit) totalHits, sum(zzimCnt) totalZzims, " +
                    "sum(reviewReplyCnt) totalReplies, sum(likeFlagCnt) totalLikes, count(1) " +
                    "totalReviews from reviewListView where memberId=?";

exports.admin_reviewPaging =
            "select reviewNum, memberId, memberName, productName, DATE_FORMAT(reviewRegdate, '%Y-%m-%d %H:%i:%s') reviewRegdate, reviewStar, likeFlagCnt, zzimCnt, reviewReplyCnt, reportFlagCnt " +
            "from reviewListView order by reviewRegdate desc limit ?, ?";

exports.admin_reviewRead =
            "select reviewNum, memberId, memberName, productName, DATE_FORMAT(reviewRegdate, '%Y-%m-%d %H:%i:%s') reviewRegdate, reviewStar, " +
            "reviewHit, likeFlagCnt, zzimCnt, reviewReplyCnt, reportFlagCnt, " +
            "reviewContent, reviewWhere, reviewPrice, reviewKnowhow, reviewGood, reviewBad, reviewRecommandPeople, " +
            "reviewPicture1, reviewPicture2, reviewPicture3, reviewPicture4, reviewPicture5, reviewIsDeleted " +
            "from reviewListView where reviewNum=?";

exports.admin_reviewReplyList =
"select reviewReplyNum, memberId, reviewReplyContent,DATE_FORMAT(reviewReplyRegdate, '%Y-%m-%d %H:%i:%s') reviewReplyRegdate, reviewReplyIsDeleted from rev_reply where reviewNum=?"

exports.reviewDelete = "UPDATE review set reviewIsDeleted = !reviewIsDeleted where reviewNum=?";

exports.reviewModifyProduct = "UPDATE review set productNum = ? where reviewNum=?";

exports.reviewReplyDelete = "UPDATE rev_reply set reviewReplyIsDeleted = !reviewReplyIsDeleted where reviewReplyNum=?";

exports.choiceListCnt = "select count(1) cnt from vote";

exports.choiceList =
            "select voteNum, voteCategory, voteTitle, memberName, memberId, DATE_FORMAT(voteRegdate, '%Y-%m-%d %H:%i:%s') voteRegdate, DATE_FORMAT(voteFinalDate, '%Y-%m-%d %H:%i:%s') voteFinalDate, voteReplyCnt, finishFlag, voteIsDeleted " +
            "from choiceListView order by voteRegdate desc limit ?, ?";

exports.choiceRead1 =
            "select voteNum, memberId, memberName, voteCategory, DATE_FORMAT(voteRegdate, '%Y-%m-%d %H:%i:%s') voteRegdate, DATE_FORMAT(voteFinalDate, '%Y-%m-%d %H:%i:%s') voteFinalDate, voteContent1, voteContent2, voteContent3, voteContent4, voteContentCnt1, voteContentCnt2, voteContentCnt3, voteContentCnt4, votePicture1, votePicture2, votePicture3, votePicture4, voteTotalCnt, finishFlag, voteIsDeleted from choiceListView where voteNum=?";
exports.choiceRead2 =
"select voteReplyNum, voteNum, memberId, voteReplyContent, DATE_FORMAT(voteReplyRegdate, '%Y-%m-%d %H:%i:%s') voteReplyRegdate, voteReplyIsDeleted from vote_reply where voteNum=?";

exports.voteDelete = "UPDATE vote set voteIsDeleted = !voteIsDeleted where voteNum=?";

exports.voteReplyDelete = "UPDATE vote_reply set voteReplyIsDeleted = !voteReplyIsDeleted where voteReplyNum=?";

exports.listFunction = function (pool, page, cntQuery, listQuery, callback){
	pool.getConnection(function (err, conn) {
	    if (err) logger.error('err', err);
	    conn.query(cntQuery, function (err, rows) {
	        if (err) logger.error('err', err);
	        var cnt = rows[0].cnt;
	        var size = 10; //보여줄 글의 수
	        var begin = (page - 1) * size; //시작 글 번호
	        var totalPage = Math.ceil(cnt / size);
	        var pageSize = 10; // 링크 갯수
	        var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //시작 링크
	        var endPage = startPage + (pageSize - 1); //끝 링크
	        if (endPage > totalPage) {
	            endPage = totalPage;
	        }
	        var max = cnt - ((page - 1) * size);
	        conn.query(listQuery, [begin, size], function (err, rows) {
	            if (err) logger.error('err', err);
	            var datas = {
	                title: "게시판 리스트",
	                data: rows,
	                page: page,
	                pageSize: pageSize,
	                startPage: startPage,
	                endPage: endPage,
	                totalPage: totalPage,
	                max: max
	            };
	            conn.release();
	            callback(datas);
	        });
	    });
	});
}

exports.readWithComment = function (pool, indexNum, readQuery, replyQuery, callback){
	pool.getConnection(function (err, conn) {
	    if (err) logger.error('err', err);
	    conn.query(readQuery, indexNum, function (err, reads) {
	        if (err) logger.error('err', err);
	        logger.debug('reads', reads);
	        conn.query(replyQuery, indexNum, function (err, comments){
	            if (err) {
	            	logger.error('err', err);
	            	callback(err, null);
	            }
	            logger.debug('comments', comments);
	            var datas = {
	            	reads : reads[0],
	            	comments : comments
	            }
	            logger.debug('datas', datas);
	            conn.release();
	            callback(null, datas);
	        })
	    })
	});
}

//db_baby.js

exports.readBaby = "select babyNum, memberId, babyName, DATE_FORMAT(addtime(babyBirth, '09:00:00'), '%Y-%m-%d') babyBirth, babyGender, babyPicture, babyIsChecked from baby where memberId=?";

exports.cntBaby = "select count(babyNum) cnt from baby where memberId=?";

exports.insertBaby = "INSERT INTO baby (memberId, babyName, babyBirth, babyGender, babyPicture, babyIsChecked) VALUES (?,?,?,?,?,?)";
exports.insertBaby2 = "INSERT INTO baby (memberId, babyName, babyBirth, babyGender, babyIsChecked) VALUES (?,?,?,?,?)";

exports.updateBaby = "update baby set babyIsChecked=0 where memberId=?";

exports.modifyBaby = function(length, memberId, babyIsChecked, callback){
	var sql1 = "", sql2 = "";
	if (babyIsChecked == 0) {  //대표 아이 미 설정시
	    if (length == 6) {  //사진 없이 처리할 때
	        sql1 = "UPDATE baby SET babyIsChecked=?, babyGender=?, babyName=?, babyBirth=? WHERE  babyNum=? and memberId=?";
	    } else if (length == 7) {
	        sql1 = "UPDATE baby SET babyIsChecked=?, babyGender=?, babyName=?, babyBirth=?, babyPicture=? WHERE  babyNum=? and memberId=?";
	    }
	} else if (babyIsChecked == 1) {    //대표 아이 설정시
	    sql1 = "update baby set babyIsChecked=0 where memberId='" + memberId + "'";
	    if (length == 6) {
	        sql2 = "UPDATE baby SET babyIsChecked=?, babyGender=?, babyName=?, babyBirth=? WHERE  babyNum=? and memberId=?";
	    } else if (length == 7) {
	        sql2 = "UPDATE baby SET babyIsChecked=?, babyGender=?, babyName=?, babyBirth=?, babyPicture=? WHERE  babyNum=? and memberId=?";
	    }
	}

	callback(sql1, sql2);
}

exports.delBaby = "DELETE FROM baby WHERE babyNum=? and memberId=?";

/***********************************************/
//db_choice.js
exports.db_choiceList = "select voteNum, voteTitle, DATE_FORMAT(voteRegdate, '%Y-%m-%d %H:%i:%s') voteRegdate, voteReplyCnt, voteTotalCnt, voteCategory " +
    "from choiceListView " +
    "where voteIsDeleted=0 ";


exports.db_choiceWrite = "INSERT INTO vote (memberId, voteContent1, voteContent2, voteContent3, " +
    "voteContent4, voteTitle, voteCategory, voteFinalDate, votePicture1, votePicture2, " +
    "votePicture3, votePicture4) VALUES(?,?,?,?,?,?,?,?,?,?,?,? )";

exports.db_choiceRead = "select voteTitle, memberName, memberPicture, voteContent1,voteContent2,voteContent3,voteContent4," +
            "votePicture1, votePicture2, votePicture3, votePicture4, " +
            "ifnull((select 1 from vote_flag where memberId =? and voteNum=?), 0) flag, " +
            "finishFlag from choiceListView where voteNum=?";

exports.db_choiceReadResult = "select memberName, memberPicture, voteTitle, voteContent1, voteContent2, voteContent3, voteContent4, votePicture1, votePicture2, votePicture3, votePicture4, result1, result2, result3, result4 from choiceResultView where voteNum=?";

exports.db_choiceDelete = "UPDATE vote SET voteIsDeleted=1 WHERE memberId=? and voteNum=?";

exports.db_choiceReply = "INSERT INTO vote_reply (voteNum, memberId, voteReplyContent) VALUES (?, ?, ?)";

exports.db_choiceGetMemberId = "select memberId from vote where voteNum=?";

exports.db_choiceGCM= "insert into gcm (senderId, receiverId, tmpIndex, type) values(?,?,?,4)";

exports.db_choiceReplyCnt = "select count(1) cnt from vote_reply where voteNum=?";

exports.db_choiceViewReply =
                "select vr.voteReplyNum, mem.memberName, mem.memberPicture, vr.voteReplyContent, vr.voteReplyRegdate " +
                "from vote_reply vr, member mem " +
                "where vr.voteNum=? and vr.voteReplyIsDeleted=0 and vr.memberId = mem.memberId " +
                "order by voteReplyRegdate desc limit ?, ?";

exports.db_choiceDelReply = "UPDATE vote_reply SET voteReplyIsDeleted=1 WHERE memberId=? and voteReplyNum=?";

//db_members.js
exports.isIdExists= "select count(*) cnt from member where memberId = ? and memberWithdraw='N'";
exports.memberJoin = "insert into member(memberId, memberPasswd, memberName, memberRegdate, memberBirth, memberEmail) values(?,?,?,now(),?,?)";
exports.confirmId = "select count(*) cnt from member where memberId=? and memberPasswd=? and memberWithdraw='N'";
exports.updateGCM = "update member set memberGCMRegId=? where memberId=?"
exports.findPW = "update member set memberFind=? where memberId=?";
exports.changePWForm = "select count(*) cnt from member where memberFind=? and memberWithdraw='N'";
exports.changePW = "update member set memberPasswd=?, memberFind=null where memberFind=?";
exports.readProfile = "select memberPicture, memberName, DATE_FORMAT(addtime(memberBirth, '09:00:00'), '%Y-%m-%d') memberBirth, memberAddress from member where memberId= ?";
exports.modifyMember = function(len, callback){
	var sql = "";
	if (len == 4) {
	    sql = "update member set memberName=?, memberBirth=?, memberAddress=? where memberId=?";
	} else if (len == 5) {
	    sql = "update member set memberPicture=?, memberName=?, memberBirth=?, memberAddress=? where memberId=?";
	}
	callback(sql);
}
exports.myPage = "select memberPicture, memberName, memberLevel, memberExp from member where memberId=?";
exports.myPage2 =
"select totalHits, totalReviews, totalLikes, totalZzims, totalReports, "+
"(totalReviews * 5 + totalLikes * 1 + totalZzims * 5 + totalReports * -10 + totalHits * 0.1 ) memberExp "+
"from (select sum(r.reviewHit) totalHits, count(r.reviewNum) totalReviews, "+
"sum((select count(1) from like_flag lf where lf.reviewNum = r.reviewNum and lf.like_flag = 1)) totalLikes, "+
"sum((select count(1) from zzim_flag zf where zf.reviewNum = r.reviewNum and zf.zzimflag = 1)) totalZzims, "+
"sum((select count(1) from reportFlag rf where rf.reviewNum = r.reviewNum and rf.reportFlag = 1)) totalReports "+
"from review r , member m "+
"where r.memberId=m.memberId and m.memberId = ?) a"
exports.cntZzim = "select count(*) from zzim_flag zf, reviewListView rlv where zf.memberId=? and zf.reviewNum = rlv.reviewNum";
exports.listZzim = "select rlv.reviewNum , rlv.productName, rlv.productBrand, rlv.reviewThumbnail reviewPicture,  rlv.likeFlagCnt, " +
    "rlv.reviewReplyCnt, rlv.reviewHit from zzim_flag zf, reviewListView rlv " +
    "where zf.memberId=? and zf.reviewNum = rlv.reviewNum and zf.zzimflag=1 limit ?,?";
exports.cntReview = "select count(1) from review where reviewIsDeleted=0 and memberId=?";

exports.memberExpFunc = function(memberExp, callback){
	var memberLevel = 0,
			expPercent = 0.0;
	for(var i = 20 ; i >= 1 ; i--){
		if(memberExp >=  ((50 * (i-1) * (i-1)) + (50 * (i-1)))){
			memberLevel = i;
			expPercent = Math.round((memberExp / ((50 * i * i) + (50 * i))) * 100);
			break;
		}
	}
	callback(expPercent, memberLevel);
}


exports.myList = "select reviewNum, productName, productBrand, reviewThumbnail reviewPicture, likeFlagCnt, " +
    "reviewReplyCnt, reviewHit from reviewListView where reviewIsDeleted=0 and memberId=? order by reviewRegdate desc limit ?,?";

exports.sideMenu = "select memberPicture, memberName, " +
"(totalReviews * 5 + totalLikes * 1 + totalZzims * 5 + totalReports * -10 + totalHits * 0.1 ) memberExp "+
"from (select m.memberPicture, m.memberName, sum(r.reviewHit) totalHits, count(r.reviewNum) totalReviews, "+
"sum((select count(1) from like_flag lf where lf.reviewNum = r.reviewNum and lf.like_flag = 1)) totalLikes, "+
"sum((select count(1) from zzim_flag zf where zf.reviewNum = r.reviewNum and zf.zzimflag = 1)) totalZzims, "+
"sum((select count(1) from reportFlag rf where rf.reviewNum = r.reviewNum and rf.reportFlag = 1)) totalReports "+
"from review r , member m where r.memberId=m.memberId and m.memberId = ?) a"

exports.getRegId = "select memberGCMRegId from member where memberId=?";


exports.getKeyword1 = "select distinct productCategory1  from product";

exports.getKeyword2 = "select distinct productCategory2  from product where productCategory1 = ?";
