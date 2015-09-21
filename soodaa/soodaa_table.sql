-- --------------------------------------------------------
-- 호스트:                          52.68.92.194
-- 서버 버전:                        10.0.17-MariaDB-1~precise-log - mariadb.org binary distribution
-- 서버 OS:                        debian-linux-gnu
-- HeidiSQL 버전:                  9.1.0.4867
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- soodaa 의 데이터베이스 구조 덤핑
CREATE DATABASE IF NOT EXISTS `soodaa` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `soodaa`;


-- 테이블 soodaa의 구조를 덤프합니다. absolutePath
CREATE TABLE IF NOT EXISTS `absolutePath` (
  `pathNum` int(11) NOT NULL AUTO_INCREMENT,
  `pathURL` varchar(256) NOT NULL,
  `pathName` varchar(50) NOT NULL,
  PRIMARY KEY (`pathNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. baby
CREATE TABLE IF NOT EXISTS `baby` (
  `babyNum` int(11) NOT NULL AUTO_INCREMENT,
  `memberId` varchar(50) DEFAULT NULL,
  `babyName` varchar(20) DEFAULT NULL,
  `babyBirth` date DEFAULT NULL,
  `babyGender` tinyint(4) DEFAULT NULL,
  `babyPicture` varchar(100) DEFAULT NULL,
  `babyIsChecked` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`babyNum`),
  KEY `memberId` (`memberId`),
  CONSTRAINT `baby_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 뷰 soodaa의 구조를 덤프합니다. choiceListView
-- VIEW 종속성 오류를 극복하기 위해 임시 테이블을 생성합니다.
CREATE TABLE `choiceListView` (
	`voteNum` INT(11) NOT NULL,
	`memberId` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`memberName` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`memberPicture` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`voteRegdate` DATETIME NOT NULL,
	`voteModifydate` DATETIME NOT NULL,
	`voteReplyCnt` BIGINT(21) NULL,
	`voteContent1` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`voteContent2` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`voteContent3` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`voteContent4` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`voteTitle` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`voteCategory` INT(11) NULL,
	`voteFinalDate` DATETIME NOT NULL,
	`votePicture1` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`votePicture2` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`votePicture3` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`votePicture4` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`voteContentCnt1` INT(11) NULL,
	`voteContentCnt2` INT(11) NULL,
	`voteContentCnt3` INT(11) NULL,
	`voteContentCnt4` INT(11) NULL,
	`voteTotalCnt` BIGINT(14) NULL,
	`finishFlag` INT(1) NOT NULL,
	`voteIsDeleted` TINYINT(1) NULL
) ENGINE=MyISAM;


-- 뷰 soodaa의 구조를 덤프합니다. choiceResultView
-- VIEW 종속성 오류를 극복하기 위해 임시 테이블을 생성합니다.
CREATE TABLE `choiceResultView` (
	`voteNum` INT(11) NOT NULL,
	`voteTitle` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`memberName` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`memberPicture` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`voteContent1` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`voteContent2` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`voteContent3` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`voteContent4` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`votePicture1` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`votePicture2` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`votePicture3` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`votePicture4` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`result1` DECIMAL(15,1) NOT NULL,
	`result2` DECIMAL(15,1) NOT NULL,
	`result3` DECIMAL(15,1) NOT NULL,
	`result4` DECIMAL(15,1) NOT NULL
) ENGINE=MyISAM;


-- 테이블 soodaa의 구조를 덤프합니다. event
CREATE TABLE IF NOT EXISTS `event` (
  `eventNum` int(11) NOT NULL AUTO_INCREMENT,
  `eventTitle` varchar(50) DEFAULT NULL,
  `eventPicture` varchar(200) NOT NULL,
  `eventRegdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eventIsDeleted` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`eventNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. gcm
CREATE TABLE IF NOT EXISTS `gcm` (
  `gcmNum` int(11) NOT NULL AUTO_INCREMENT,
  `senderId` varchar(50) DEFAULT NULL,
  `receiverId` varchar(50) DEFAULT NULL,
  `chatContent` text,
  `gcmFlag` tinyint(4) DEFAULT '0',
  `type` tinyint(4) DEFAULT '0',
  `tmpIndex` int(11) DEFAULT NULL,
  `gcmDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gcmNum`),
  KEY `senderId` (`senderId`),
  KEY `FK_chat_member_2` (`receiverId`),
  CONSTRAINT `FK_chat_member` FOREIGN KEY (`senderId`) REFERENCES `member` (`memberId`),
  CONSTRAINT `FK_chat_member_2` FOREIGN KEY (`receiverId`) REFERENCES `member` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. level
CREATE TABLE IF NOT EXISTS `level` (
  `levelNum` int(11) NOT NULL,
  `startExp` int(11) NOT NULL,
  `endExp` int(11) NOT NULL,
  PRIMARY KEY (`levelNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. like_flag
CREATE TABLE IF NOT EXISTS `like_flag` (
  `like_flag` tinyint(4) NOT NULL DEFAULT '1',
  `memberId` varchar(50) NOT NULL,
  `reviewNum` int(11) NOT NULL,
  PRIMARY KEY (`memberId`,`reviewNum`),
  KEY `reviewNum` (`reviewNum`),
  CONSTRAINT `Like_flag_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`),
  CONSTRAINT `Like_flag_ibfk_2` FOREIGN KEY (`reviewNum`) REFERENCES `review` (`reviewNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. member
CREATE TABLE IF NOT EXISTS `member` (
  `memberId` varchar(50) NOT NULL,
  `memberPasswd` varchar(100) DEFAULT NULL,
  `memberName` varchar(50) NOT NULL,
  `memberBirth` date DEFAULT NULL,
  `memberRegdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `memberLevel` int(11) DEFAULT '1',
  `memberExp` int(11) DEFAULT '0',
  `memberGender` int(11) DEFAULT NULL,
  `memberPicture` varchar(100) DEFAULT 'member_picture.png',
  `memberWithdraw` varchar(2) DEFAULT 'N',
  `memberFbAccessToken` varchar(500) DEFAULT NULL,
  `memberAddress` varchar(100) DEFAULT NULL,
  `memberEmailRandom` varchar(256) DEFAULT NULL,
  `memberEmail` varchar(256) DEFAULT NULL,
  `memberEmailFlag` tinyint(4) NOT NULL DEFAULT '0',
  `memberGCMRegId` varchar(200) DEFAULT NULL,
  `memberFind` varchar(15) DEFAULT NULL,
  `memberOption` tinyint(4) DEFAULT '2',
  `rankWeek` int(11) DEFAULT '0',
  `rankMonth` int(11) DEFAULT '0',
  `rankTotal` int(11) DEFAULT '0',
  `rankTotal1` int(11) DEFAULT '0',
  PRIMARY KEY (`memberId`),
  KEY `memberGCMRegId` (`memberGCMRegId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. notice
CREATE TABLE IF NOT EXISTS `notice` (
  `noticeNum` int(11) NOT NULL AUTO_INCREMENT,
  `memberId` varchar(50) NOT NULL,
  `noticeContent` text NOT NULL,
  `noticeRegdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `noticeModifydate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `noticeIsDeleted` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`noticeNum`),
  KEY `FK_member_notice` (`memberId`),
  CONSTRAINT `FK_member_notice` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. product
CREATE TABLE IF NOT EXISTS `product` (
  `productNum` int(11) NOT NULL AUTO_INCREMENT,
  `productBrand` varchar(50) DEFAULT '',
  `productCategory1` varchar(100) DEFAULT NULL,
  `productCategory2` varchar(100) DEFAULT NULL,
  `productName` varchar(200) DEFAULT NULL,
  `productStartAge` int(11) DEFAULT NULL,
  `productEndAge` int(11) DEFAULT NULL,
  `productRegdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `productAvgStar` int(11) DEFAULT NULL,
  PRIMARY KEY (`productNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. reportFlag
CREATE TABLE IF NOT EXISTS `reportFlag` (
  `reportFlag` tinyint(4) NOT NULL DEFAULT '1',
  `memberId` varchar(50) NOT NULL,
  `reviewNum` int(11) NOT NULL,
  `reportContent` varchar(200) NOT NULL,
  `reportDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`memberId`,`reviewNum`),
  KEY `reviewNum` (`reviewNum`),
  CONSTRAINT `reportFlag_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`),
  CONSTRAINT `reportFlag_ibfk_2` FOREIGN KEY (`reviewNum`) REFERENCES `review` (`reviewNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. review
CREATE TABLE IF NOT EXISTS `review` (
  `reviewNum` int(11) NOT NULL AUTO_INCREMENT,
  `productNum` int(11) DEFAULT NULL,
  `memberId` varchar(50) DEFAULT NULL,
  `reviewRegdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `reviewModifydate` datetime DEFAULT CURRENT_TIMESTAMP,
  `reviewContent` text,
  `reviewHit` int(11) DEFAULT '0',
  `reviewWhere` varchar(100) DEFAULT NULL,
  `reviewPrice` int(11) DEFAULT NULL,
  `reviewKnowhow` varchar(200) DEFAULT '',
  `reviewGood` varchar(100) DEFAULT NULL,
  `reviewBad` varchar(100) DEFAULT NULL,
  `reviewRecommandPeople` varchar(100) DEFAULT NULL,
  `reviewStar` float DEFAULT NULL,
  `reviewThumbnail` varchar(100) DEFAULT NULL,
  `reviewPicture1` varchar(100) DEFAULT NULL,
  `reviewPicture2` varchar(100) DEFAULT NULL,
  `reviewPicture3` varchar(100) DEFAULT NULL,
  `reviewPicture4` varchar(100) DEFAULT NULL,
  `reviewPicture5` varchar(100) DEFAULT NULL,
  `reviewIsDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`reviewNum`),
  KEY `productNum` (`productNum`),
  KEY `memberId` (`memberId`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`productNum`) REFERENCES `product` (`productNum`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 뷰 soodaa의 구조를 덤프합니다. reviewListView
-- VIEW 종속성 오류를 극복하기 위해 임시 테이블을 생성합니다.
CREATE TABLE `reviewListView` (
	`reviewNum` INT(11) NOT NULL,
	`productNum` INT(11) NULL,
	`memberId` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`reviewRegdate` DATETIME NULL,
	`reviewModifydate` DATETIME NULL,
	`reviewContent` TEXT NULL COLLATE 'utf8_general_ci',
	`reviewHit` INT(11) NULL,
	`reviewWhere` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewPrice` INT(11) NULL,
	`reviewKnowhow` VARCHAR(200) NULL COLLATE 'utf8_general_ci',
	`reviewGood` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewBad` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewRecommandPeople` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewStar` FLOAT NULL,
	`reviewThumbnail` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewPicture1` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewPicture2` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewPicture3` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewPicture4` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewPicture5` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`reviewIsDeleted` TINYINT(1) NULL,
	`productName` VARCHAR(200) NULL COLLATE 'utf8_general_ci',
	`productBrand` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`productCategory1` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`productCategory2` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`memberName` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`memberPicture` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`zzimCnt` BIGINT(21) NULL,
	`reviewReplyCnt` BIGINT(21) NULL,
	`reportFlagCnt` BIGINT(21) NULL,
	`likeFlagCnt` BIGINT(21) NULL,
	`productStartAge` INT(11) NULL,
	`productEndAge` INT(11) NULL
) ENGINE=MyISAM;


-- 테이블 soodaa의 구조를 덤프합니다. rev_reply
CREATE TABLE IF NOT EXISTS `rev_reply` (
  `reviewReplyNum` int(11) NOT NULL AUTO_INCREMENT,
  `reviewNum` int(11) DEFAULT NULL,
  `memberId` varchar(50) DEFAULT NULL,
  `reviewReplyContent` varchar(200) DEFAULT NULL,
  `reviewReplyRegdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `reviewReplyIsDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`reviewReplyNum`),
  KEY `reviewNum` (`reviewNum`),
  KEY `memberId` (`memberId`),
  CONSTRAINT `rev_reply_ibfk_1` FOREIGN KEY (`reviewNum`) REFERENCES `review` (`reviewNum`),
  CONSTRAINT `rev_reply_ibfk_2` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. search
CREATE TABLE IF NOT EXISTS `search` (
  `searchQuery` varchar(50) NOT NULL,
  `queryCount` int(11) DEFAULT NULL,
  PRIMARY KEY (`searchQuery`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. todayLikeFlag
CREATE TABLE IF NOT EXISTS `todayLikeFlag` (
  `todayLikeFlag` tinyint(4) NOT NULL DEFAULT '1',
  `memberId` varchar(50) NOT NULL,
  `todaysCareNum` int(11) NOT NULL,
  PRIMARY KEY (`memberId`,`todaysCareNum`),
  KEY `todaysCareNum` (`todaysCareNum`),
  CONSTRAINT `Todays_flag_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`),
  CONSTRAINT `Todays_flag_ibfk_2` FOREIGN KEY (`todaysCareNum`) REFERENCES `todays` (`todaysCareNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. todayReply
CREATE TABLE IF NOT EXISTS `todayReply` (
  `todayReplyNum` int(11) NOT NULL AUTO_INCREMENT,
  `todaysCareNum` int(11) DEFAULT NULL,
  `memberId` varchar(50) DEFAULT NULL,
  `todayReplyContent` varchar(200) DEFAULT NULL,
  `todayReplyRegdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `todayReplyIsDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`todayReplyNum`),
  KEY `todaysCareNum` (`todaysCareNum`),
  KEY `memberId` (`memberId`),
  CONSTRAINT `today_reply_ibfk_1` FOREIGN KEY (`todaysCareNum`) REFERENCES `todays` (`todaysCareNum`),
  CONSTRAINT `today_reply_ibfk_2` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. todays
CREATE TABLE IF NOT EXISTS `todays` (
  `todaysCareNum` int(11) NOT NULL AUTO_INCREMENT,
  `memberId` varchar(50) DEFAULT NULL,
  `todaysCareTitle` varchar(50) DEFAULT NULL,
  `todaysCareRegdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `todaysCareModifydate` datetime DEFAULT CURRENT_TIMESTAMP,
  `todaysCareContent` text,
  `todaysCareHit` int(11) DEFAULT '0',
  `todaysCareThumbnail` varchar(100) DEFAULT NULL,
  `todaysCarePicture1` varchar(100) DEFAULT NULL,
  `todaysCarePicture2` varchar(100) DEFAULT NULL,
  `todaysCarePicture3` varchar(100) DEFAULT NULL,
  `todaysCarePicture4` varchar(100) DEFAULT NULL,
  `todaysCarePicture5` varchar(100) DEFAULT NULL,
  `todaysCarePicture6` varchar(100) DEFAULT NULL,
  `todaysCarePicture7` varchar(100) DEFAULT NULL,
  `todaysCarePicture8` varchar(100) DEFAULT NULL,
  `todaysCarePicture9` varchar(100) DEFAULT NULL,
  `todaysCarePicture10` varchar(100) DEFAULT NULL,
  `todaysCareIsDeleted` tinyint(1) DEFAULT '0',
  `todaysCareCategory` int(11) DEFAULT NULL,
  PRIMARY KEY (`todaysCareNum`),
  KEY `memberId` (`memberId`),
  CONSTRAINT `todays_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 뷰 soodaa의 구조를 덤프합니다. todaysListView
-- VIEW 종속성 오류를 극복하기 위해 임시 테이블을 생성합니다.
CREATE TABLE `todaysListView` (
	`todaysCareNum` INT(11) NOT NULL,
	`memberId` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`todaysCareTitle` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`todaysCareRegdate` DATETIME NULL,
	`todaysCareModifydate` DATETIME NULL,
	`todaysCareContent` TEXT NULL COLLATE 'utf8_general_ci',
	`todaysCareHit` INT(11) NULL,
	`todaysCareCategory` INT(11) NULL,
	`todaysCareThumbnail` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture1` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture2` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture3` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture4` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture5` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture6` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture7` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture8` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture9` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCarePicture10` VARCHAR(100) NULL COLLATE 'utf8_general_ci',
	`todaysCareIsDeleted` TINYINT(1) NULL,
	`memberName` VARCHAR(50) NULL COLLATE 'utf8_general_ci',
	`todaysCareLikeCnt` BIGINT(21) NULL,
	`todaysCareReplyCnt` BIGINT(21) NULL
) ENGINE=MyISAM;


-- 테이블 soodaa의 구조를 덤프합니다. vote
CREATE TABLE IF NOT EXISTS `vote` (
  `voteNum` int(11) NOT NULL AUTO_INCREMENT,
  `memberId` varchar(50) DEFAULT NULL,
  `voteRegdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `voteModifydate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `voteContent1` varchar(50) DEFAULT NULL,
  `voteContent2` varchar(50) DEFAULT NULL,
  `voteContent3` varchar(50) DEFAULT NULL,
  `voteContent4` varchar(50) DEFAULT NULL,
  `voteTitle` varchar(50) DEFAULT NULL,
  `voteCategory` int(11) DEFAULT NULL,
  `voteFinalDate` datetime NOT NULL,
  `votePicture1` varchar(100) DEFAULT NULL,
  `votePicture2` varchar(100) DEFAULT NULL,
  `votePicture3` varchar(100) DEFAULT NULL,
  `votePicture4` varchar(100) DEFAULT NULL,
  `voteContentCnt1` int(11) DEFAULT '0',
  `voteContentCnt2` int(11) DEFAULT '0',
  `voteContentCnt3` int(11) DEFAULT '0',
  `voteContentCnt4` int(11) DEFAULT '0',
  `voteIsDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`voteNum`),
  KEY `memberId` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. vote_flag
CREATE TABLE IF NOT EXISTS `vote_flag` (
  `vote_flag` tinyint(4) NOT NULL DEFAULT '1',
  `memberId` varchar(50) NOT NULL,
  `voteNum` int(11) NOT NULL,
  PRIMARY KEY (`memberId`,`voteNum`),
  KEY `voteNum` (`voteNum`),
  CONSTRAINT `vote_flag_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`),
  CONSTRAINT `vote_flag_ibfk_2` FOREIGN KEY (`voteNum`) REFERENCES `vote` (`voteNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. vote_reply
CREATE TABLE IF NOT EXISTS `vote_reply` (
  `voteReplyNum` int(11) NOT NULL AUTO_INCREMENT,
  `voteNum` int(11) DEFAULT NULL,
  `memberId` varchar(50) DEFAULT NULL,
  `voteReplyContent` varchar(200) DEFAULT NULL,
  `voteReplyRegdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `voteReplyIsDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`voteReplyNum`),
  KEY `voteNum` (`voteNum`),
  KEY `memberId` (`memberId`),
  CONSTRAINT `vote_reply_ibfk_1` FOREIGN KEY (`voteNum`) REFERENCES `vote` (`voteNum`),
  CONSTRAINT `vote_reply_ibfk_2` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 테이블 soodaa의 구조를 덤프합니다. zzim_flag
CREATE TABLE IF NOT EXISTS `zzim_flag` (
  `zzimflag` tinyint(4) NOT NULL DEFAULT '1',
  `memberId` varchar(50) NOT NULL,
  `reviewNum` int(11) NOT NULL,
  PRIMARY KEY (`memberId`,`reviewNum`),
  KEY `reviewNum` (`reviewNum`),
  CONSTRAINT `Zzim_flag_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`memberId`),
  CONSTRAINT `Zzim_flag_ibfk_2` FOREIGN KEY (`reviewNum`) REFERENCES `review` (`reviewNum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.


-- 뷰 soodaa의 구조를 덤프합니다. choiceListView
-- 임시 테이블을 제거하고 최종 VIEW 구조를 생성
DROP TABLE IF EXISTS `choiceListView`;
CREATE ALGORITHM=UNDEFINED DEFINER=`song`@`%` SQL SECURITY DEFINER VIEW `choiceListView` AS (select `v`.`voteNum` AS `voteNum`,`v`.`memberId` AS `memberId`,(select `mem`.`memberName` from `member` `mem` where (`mem`.`memberId` = `v`.`memberId`)) AS `memberName`,(select `mem`.`memberPicture` from `member` `mem` where (`mem`.`memberId` = `v`.`memberId`)) AS `memberPicture`,`v`.`voteRegdate` AS `voteRegdate`,`v`.`voteModifydate` AS `voteModifydate`,(select count(`vr`.`voteReplyNum`) from `vote_reply` `vr` where (`vr`.`voteNum` = `v`.`voteNum`)) AS `voteReplyCnt`,`v`.`voteContent1` AS `voteContent1`,`v`.`voteContent2` AS `voteContent2`,`v`.`voteContent3` AS `voteContent3`,`v`.`voteContent4` AS `voteContent4`,`v`.`voteTitle` AS `voteTitle`,`v`.`voteCategory` AS `voteCategory`,`v`.`voteFinalDate` AS `voteFinalDate`,`v`.`votePicture1` AS `votePicture1`,`v`.`votePicture2` AS `votePicture2`,`v`.`votePicture3` AS `votePicture3`,`v`.`votePicture4` AS `votePicture4`,`v`.`voteContentCnt1` AS `voteContentCnt1`,`v`.`voteContentCnt2` AS `voteContentCnt2`,`v`.`voteContentCnt3` AS `voteContentCnt3`,`v`.`voteContentCnt4` AS `voteContentCnt4`,(((`v`.`voteContentCnt1` + `v`.`voteContentCnt2`) + `v`.`voteContentCnt3`) + `v`.`voteContentCnt4`) AS `voteTotalCnt`,if((`v`.`voteFinalDate` < now()),1,0) AS `finishFlag`,`v`.`voteIsDeleted` AS `voteIsDeleted` from `vote` `v`);


-- 뷰 soodaa의 구조를 덤프합니다. choiceResultView
-- 임시 테이블을 제거하고 최종 VIEW 구조를 생성
DROP TABLE IF EXISTS `choiceResultView`;
CREATE ALGORITHM=UNDEFINED DEFINER=`song`@`%` SQL SECURITY DEFINER VIEW `choiceResultView` AS (select `choiceListView`.`voteNum` AS `voteNum`,`choiceListView`.`voteTitle` AS `voteTitle`,`choiceListView`.`memberName` AS `memberName`,`choiceListView`.`memberPicture` AS `memberPicture`,`choiceListView`.`voteContent1` AS `voteContent1`,`choiceListView`.`voteContent2` AS `voteContent2`,`choiceListView`.`voteContent3` AS `voteContent3`,`choiceListView`.`voteContent4` AS `voteContent4`,`choiceListView`.`votePicture1` AS `votePicture1`,`choiceListView`.`votePicture2` AS `votePicture2`,`choiceListView`.`votePicture3` AS `votePicture3`,`choiceListView`.`votePicture4` AS `votePicture4`,ifnull(round((100 * (`choiceListView`.`voteContentCnt1` / (((`choiceListView`.`voteContentCnt1` + `choiceListView`.`voteContentCnt2`) + `choiceListView`.`voteContentCnt3`) + `choiceListView`.`voteContentCnt4`))),1),0) AS `result1`,ifnull(round((100 * (`choiceListView`.`voteContentCnt2` / (((`choiceListView`.`voteContentCnt1` + `choiceListView`.`voteContentCnt2`) + `choiceListView`.`voteContentCnt3`) + `choiceListView`.`voteContentCnt4`))),1),0) AS `result2`,ifnull(round((100 * (`choiceListView`.`voteContentCnt3` / (((`choiceListView`.`voteContentCnt1` + `choiceListView`.`voteContentCnt2`) + `choiceListView`.`voteContentCnt3`) + `choiceListView`.`voteContentCnt4`))),1),0) AS `result3`,ifnull(round((100 * (`choiceListView`.`voteContentCnt4` / (((`choiceListView`.`voteContentCnt1` + `choiceListView`.`voteContentCnt2`) + `choiceListView`.`voteContentCnt3`) + `choiceListView`.`voteContentCnt4`))),1),0) AS `result4` from `choiceListView`);


-- 뷰 soodaa의 구조를 덤프합니다. reviewListView
-- 임시 테이블을 제거하고 최종 VIEW 구조를 생성
DROP TABLE IF EXISTS `reviewListView`;
CREATE ALGORITHM=UNDEFINED DEFINER=`song`@`%` SQL SECURITY DEFINER VIEW `reviewListView` AS (select `r`.`reviewNum` AS `reviewNum`,`r`.`productNum` AS `productNum`,`r`.`memberId` AS `memberId`,`r`.`reviewRegdate` AS `reviewRegdate`,`r`.`reviewModifydate` AS `reviewModifydate`,`r`.`reviewContent` AS `reviewContent`,`r`.`reviewHit` AS `reviewHit`,`r`.`reviewWhere` AS `reviewWhere`,`r`.`reviewPrice` AS `reviewPrice`,`r`.`reviewKnowhow` AS `reviewKnowhow`,`r`.`reviewGood` AS `reviewGood`,`r`.`reviewBad` AS `reviewBad`,`r`.`reviewRecommandPeople` AS `reviewRecommandPeople`,`r`.`reviewStar` AS `reviewStar`,`r`.`reviewThumbnail` AS `reviewThumbnail`,`r`.`reviewPicture1` AS `reviewPicture1`,`r`.`reviewPicture2` AS `reviewPicture2`,`r`.`reviewPicture3` AS `reviewPicture3`,`r`.`reviewPicture4` AS `reviewPicture4`,`r`.`reviewPicture5` AS `reviewPicture5`,`r`.`reviewIsDeleted` AS `reviewIsDeleted`,`pd`.`productName` AS `productName`,`pd`.`productBrand` AS `productBrand`,`pd`.`productCategory1` AS `productCategory1`,`pd`.`productCategory2` AS `productCategory2`,`mem`.`memberName` AS `memberName`,`mem`.`memberPicture` AS `memberPicture`,(select count(1) from `zzim_flag` `zf` where (`zf`.`reviewNum` = `r`.`reviewNum`)) AS `zzimCnt`,(select count(1) from `rev_reply` `rr` where ((`rr`.`reviewNum` = `r`.`reviewNum`) and (`rr`.`reviewReplyIsDeleted` = 0))) AS `reviewReplyCnt`,(select count(1) from `reportFlag` `rf` where (`rf`.`reviewNum` = `r`.`reviewNum`)) AS `reportFlagCnt`,(select count(1) from `like_flag` `lf` where ((`lf`.`reviewNum` = `r`.`reviewNum`) and (`lf`.`like_flag` = 1))) AS `likeFlagCnt`,`pd`.`productStartAge` AS `productStartAge`,`pd`.`productEndAge` AS `productEndAge` from ((`review` `r` join `product` `pd`) join `member` `mem`) where ((`pd`.`productNum` = `r`.`productNum`) and (`mem`.`memberId` = `r`.`memberId`)));


-- 뷰 soodaa의 구조를 덤프합니다. todaysListView
-- 임시 테이블을 제거하고 최종 VIEW 구조를 생성
DROP TABLE IF EXISTS `todaysListView`;
CREATE ALGORITHM=UNDEFINED DEFINER=`song`@`%` SQL SECURITY DEFINER VIEW `todaysListView` AS (select `t`.`todaysCareNum` AS `todaysCareNum`,`t`.`memberId` AS `memberId`,`t`.`todaysCareTitle` AS `todaysCareTitle`,`t`.`todaysCareRegdate` AS `todaysCareRegdate`,`t`.`todaysCareModifydate` AS `todaysCareModifydate`,`t`.`todaysCareContent` AS `todaysCareContent`,`t`.`todaysCareHit` AS `todaysCareHit`,`t`.`todaysCareCategory` AS `todaysCareCategory`,`t`.`todaysCareThumbnail` AS `todaysCareThumbnail`,`t`.`todaysCarePicture1` AS `todaysCarePicture1`,`t`.`todaysCarePicture2` AS `todaysCarePicture2`,`t`.`todaysCarePicture3` AS `todaysCarePicture3`,`t`.`todaysCarePicture4` AS `todaysCarePicture4`,`t`.`todaysCarePicture5` AS `todaysCarePicture5`,`t`.`todaysCarePicture6` AS `todaysCarePicture6`,`t`.`todaysCarePicture7` AS `todaysCarePicture7`,`t`.`todaysCarePicture8` AS `todaysCarePicture8`,`t`.`todaysCarePicture9` AS `todaysCarePicture9`,`t`.`todaysCarePicture10` AS `todaysCarePicture10`,`t`.`todaysCareIsDeleted` AS `todaysCareIsDeleted`,(select `mem`.`memberName` from `member` `mem` where (`mem`.`memberId` = `t`.`memberId`)) AS `memberName`,(select count(`tlf`.`todaysCareNum`) from `todayLikeFlag` `tlf` where (`tlf`.`todaysCareNum` = `t`.`todaysCareNum`)) AS `todaysCareLikeCnt`,(select count(`tr`.`todaysCareNum`) from `todayReply` `tr` where (`tr`.`todaysCareNum` = `t`.`todaysCareNum`)) AS `todaysCareReplyCnt` from `todays` `t`);
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
