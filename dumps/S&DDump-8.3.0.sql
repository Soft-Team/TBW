CREATE DATABASE  IF NOT EXISTS `dbtrabawho` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `dbtrabawho`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: dbtrabawho
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblcancellation`
--

DROP TABLE IF EXISTS `tblcancellation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcancellation` (
  `intCancelID` int(11) NOT NULL AUTO_INCREMENT,
  `intCancelChatID` int(11) NOT NULL,
  `intCancelAccNo` int(9) NOT NULL,
  `dtmCancelDate` datetime NOT NULL,
  `txtCancelReason` text NOT NULL,
  PRIMARY KEY (`intCancelID`),
  KEY `intCancelChatID_idx` (`intCancelChatID`),
  KEY `intCancelAccNo_idx` (`intCancelAccNo`),
  CONSTRAINT `intCancelAccNo` FOREIGN KEY (`intCancelAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intCancelChatID` FOREIGN KEY (`intCancelChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcancellation`
--

INSERT INTO `tblcancellation` VALUES (12,40,4,'2018-04-02 14:15:03','asd'),(13,41,4,'2018-04-02 14:15:44','aaa'),(14,42,4,'2018-04-02 14:16:01','awd'),(15,43,3,'2018-04-02 14:17:22','cc'),(16,31,3,'2018-04-02 14:30:12','asd'),(17,44,3,'2018-04-02 17:17:05','asd'),(18,46,3,'2018-04-02 17:17:40','dd'),(19,45,3,'2018-04-02 17:17:43','cc');

--
-- Table structure for table `tblchat`
--

DROP TABLE IF EXISTS `tblchat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblchat` (
  `intChatID` int(11) NOT NULL AUTO_INCREMENT,
  `intChatSeeker` int(9) NOT NULL COMMENT 'FK',
  `intChatServ` int(11) NOT NULL,
  `intChatStatus` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intChatID`),
  KEY `intUser1_idx` (`intChatSeeker`),
  KEY `intChatServ_idx` (`intChatServ`),
  CONSTRAINT `intChatServ` FOREIGN KEY (`intChatServ`) REFERENCES `tblservice` (`intServID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intUser1` FOREIGN KEY (`intChatSeeker`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblchat`
--

INSERT INTO `tblchat` VALUES (26,1,36,0),(27,1,32,0),(28,2,1,0),(29,4,1,0),(30,1,37,0),(31,1,35,0),(34,7,42,0),(35,7,42,0),(36,1,42,0),(37,1,42,0),(38,1,42,0),(39,4,34,0),(40,4,6,0),(41,4,32,0),(42,4,40,0),(43,3,36,0),(44,3,37,0),(45,3,42,0),(46,3,6,0),(47,1,32,1),(48,1,42,1);

--
-- Table structure for table `tbldocument`
--

DROP TABLE IF EXISTS `tbldocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbldocument` (
  `intDocID` int(11) NOT NULL AUTO_INCREMENT,
  `intDocAccNo` int(9) NOT NULL,
  `strDocument` varchar(100) NOT NULL,
  PRIMARY KEY (`intDocID`),
  KEY `intDocAccNo_idx` (`intDocAccNo`),
  CONSTRAINT `intDocAccNo` FOREIGN KEY (`intDocAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbldocument`
--

INSERT INTO `tbldocument` VALUES (6,1,'DOC-000000001PEYBicYW5W8heo1H3khpg8PVIjnExc.jpg'),(9,1,'DOC-000000001u0tGvB7aOpmBAdKUKP4xVtmDEQtNkh.jpg'),(10,8,'DOC-000000008XBuYjSpIvNdx65G5uoOAQHSc1lmCDC.jpg'),(11,1,'DOC-000000001S6iY6ur9e7Zw5dN7woaxUmUChahusd.jpg'),(12,1,'DOC-000000001KDPXnseWX0KuRTMznIhEEkhOfbrOZi.jpg'),(13,1,'DOC-000000001rSVMukR7JfudSYBlb7ofPkdVkic2jZ.jpg'),(15,1,'DOC-000000001YTI7vKxfxGhiu15DJ54uYYscioygOC.jpg');

--
-- Table structure for table `tblmessage`
--

DROP TABLE IF EXISTS `tblmessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblmessage` (
  `intMessID` int(11) NOT NULL AUTO_INCREMENT,
  `intMessChatID` int(11) NOT NULL COMMENT 'FK',
  `txtMessage` text NOT NULL,
  `dtmDateSent` datetime NOT NULL,
  `intMessPSeen` int(1) NOT NULL DEFAULT '0',
  `intMessSSeen` int(1) NOT NULL DEFAULT '0',
  `intSender` int(1) NOT NULL,
  PRIMARY KEY (`intMessID`),
  KEY `intMessChatID_idx` (`intMessChatID`),
  CONSTRAINT `intMessChatID` FOREIGN KEY (`intMessChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblmessage`
--

INSERT INTO `tblmessage` VALUES (161,26,'hm cyst\r\n','2018-02-27 15:12:01',1,1,2),(162,26,'pm sent','2018-02-27 15:14:19',1,1,1),(163,26,'-- I have created an invoice, check it out on the upper right corner!','2018-02-27 15:14:50',1,1,1),(164,26,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-02-27 15:15:28',1,1,1),(165,27,'xxxx','2018-03-02 01:22:37',1,1,2),(166,26,'a','2018-03-02 01:25:11',1,1,2),(167,27,'-- I have created an invoice, check it out on the upper right corner!','2018-03-02 01:44:22',1,1,1),(168,27,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-03-02 01:44:30',0,1,1),(169,28,'sad','2018-03-02 02:43:18',1,1,2),(170,28,'-- I have created an invoice, check it out on the upper right corner!','2018-03-02 02:43:33',1,1,1),(171,28,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-03-02 02:43:38',1,1,1),(172,29,'x','2018-03-02 03:01:39',1,1,2),(173,29,'-- I have created an invoice, check it out on the upper right corner!','2018-03-02 03:01:50',1,1,1),(174,29,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-03-02 03:01:58',1,1,1),(175,30,'x','2018-03-02 04:56:52',1,1,2),(176,30,'-- has CANCELLED this chat and its transaction.','2018-03-02 05:02:47',1,1,1),(177,30,'-- has CANCELLED this chat and its transaction.','2018-03-02 05:09:01',1,1,2),(178,30,'asd','2018-03-02 05:09:25',1,1,2),(179,30,'-- I have created an invoice, check it out on the upper right corner!','2018-03-02 05:09:55',1,1,1),(180,30,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-03-02 05:10:02',1,1,1),(181,30,'-- transaction has FINISHED','2018-03-02 05:10:13',1,1,1),(182,31,'slap','2018-03-29 15:18:10',1,1,2),(242,31,'a','2018-03-29 18:58:48',1,1,2),(243,31,'a','2018-03-29 18:59:11',1,1,2),(244,31,'asd','2018-03-29 18:59:56',1,1,2),(248,34,'lesgow','2018-03-30 22:48:40',1,1,2),(249,34,'-- has CANCELLED this chat and its transaction.','2018-03-30 23:06:31',1,1,2),(250,35,'hhh','2018-03-30 23:06:48',1,1,2),(251,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 21:36:50',1,1,1),(252,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 21:39:18',1,1,1),(253,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 21:50:40',1,1,1),(254,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 21:51:53',1,1,1),(255,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 21:53:50',1,1,1),(256,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 21:54:52',1,1,1),(257,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 22:22:25',1,1,1),(258,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 22:24:59',1,1,1),(259,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 22:27:12',1,1,1),(260,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 22:31:22',1,1,1),(261,35,'-- I have created an invoice, check it out on the upper right corner!','2018-03-31 22:33:50',1,1,1),(262,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:39:44',1,1,1),(263,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:39:58',1,1,1),(264,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:48:17',1,1,1),(265,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:48:24',1,1,1),(266,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:48:30',1,1,1),(267,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:48:34',1,1,1),(268,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:48:42',1,1,1),(269,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:50:04',1,1,1),(270,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:50:31',1,1,1),(271,31,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 01:56:15',1,1,1),(272,31,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:58:08',1,1,1),(273,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 01:58:40',1,1,1),(275,35,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','2018-04-01 02:00:46',1,1,1),(276,35,'-- has CANCELLED this chat and its transaction.','2018-04-01 02:23:36',1,1,1),(277,35,'-- has CANCELLED this chat and its transaction.','2018-04-01 02:37:07',1,1,1),(278,35,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 02:38:25',1,1,1),(279,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 02:38:32',1,1,1),(280,35,'-- has CANCELLED this chat and its transaction.','2018-04-01 02:38:37',1,1,1),(281,35,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 02:49:56',1,1,1),(282,31,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 02:54:00',1,1,1),(283,31,'-- has CANCELLED this chat and its transaction.','2018-04-01 02:54:07',1,1,1),(284,35,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 03:17:21',1,1,1),(286,35,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 19:02:09',1,1,1),(288,35,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 19:04:21',1,1,1),(289,35,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 19:12:32',1,1,1),(290,35,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 19:12:42',1,1,1),(291,35,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 19:12:58',1,1,1),(292,36,'kkk','2018-04-01 19:19:18',1,1,2),(293,36,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 19:19:45',1,1,1),(294,36,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 19:19:55',1,1,1),(295,36,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 19:20:08',1,1,1),(296,36,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 19:59:04',1,1,1),(297,36,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 19:59:22',1,1,1),(298,36,'-- has CANCELLED this chat and its transaction.','2018-04-01 19:59:44',1,1,1),(299,36,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 20:36:06',1,1,1),(300,36,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 20:36:31',1,1,1),(301,36,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 20:36:40',1,1,1),(302,36,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 20:40:03',1,1,1),(303,35,'-- Our Workers are Busy at the moment, please come back once we are available!','2018-04-01 20:40:03',1,1,1),(304,36,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 20:40:23',1,1,1),(305,35,'-- Our Workers are Busy at the moment, please come back once we are available!','2018-04-01 20:40:23',1,1,1),(306,36,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 21:48:16',1,1,1),(307,36,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 21:48:25',1,1,1),(308,36,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 21:48:37',1,1,1),(309,36,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 22:43:43',1,1,1),(311,36,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 22:46:05',1,1,1),(312,35,'-- Our Workers are Busy at the moment, please come back once we are available!','2018-04-01 22:46:05',1,0,1),(313,36,'-- has CANCELLED this chat and its transaction.','2018-04-01 22:49:34',1,1,2),(314,37,'x','2018-04-01 22:58:50',1,1,2),(315,37,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 22:59:34',1,1,1),(316,37,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-01 22:59:41',1,1,1),(317,37,'-- has CANCELLED this chat and its transaction.','2018-04-01 23:04:11',1,1,1),(318,38,'s','2018-04-01 23:04:42',1,1,2),(319,38,'-- I have created an invoice, check it out on the upper right corner!','2018-04-01 23:05:02',1,1,1),(320,38,'-- I have FIXED the invoice, check it out on the upper right corner!','2018-04-01 23:14:18',1,1,1),(321,38,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-04-02 00:31:55',1,1,1),(322,38,'ssw','2018-04-02 01:46:03',1,1,2),(323,38,'a','2018-04-02 01:46:39',1,1,2),(324,38,'-- transaction has FINISHED','2018-04-02 02:31:40',1,1,1),(325,39,'asd','2018-04-02 13:36:29',0,1,2),(326,39,'-- has CANCELLED this chat and its transaction.','2018-04-02 14:13:33',1,1,1),(327,40,'s','2018-04-02 14:14:59',0,1,2),(328,40,'-- has CANCELLED this chat and its transaction.','2018-04-02 14:15:03',0,1,2),(329,41,'sss','2018-04-02 14:15:41',0,1,2),(330,41,'-- has CANCELLED this chat and its transaction.','2018-04-02 14:15:44',0,1,2),(331,42,'wa','2018-04-02 14:15:57',0,1,2),(332,42,'-- has CANCELLED this chat and its transaction.','2018-04-02 14:16:01',0,1,2),(333,43,'ask','2018-04-02 14:17:20',1,1,2),(334,43,'-- has CANCELLED this chat and its transaction.','2018-04-02 14:17:22',1,1,2),(335,31,'-- I have created an invoice, check it out on the upper right corner!','2018-04-02 14:30:07',1,1,1),(336,31,'-- has CANCELLED this chat and its transaction.','2018-04-02 14:30:12',1,1,1),(337,44,'asd','2018-04-02 14:48:06',1,1,2),(338,44,'asd','2018-04-02 14:59:12',1,1,2),(339,44,'aaaa','2018-04-02 14:59:21',1,1,2),(340,44,'ddd','2018-04-02 15:00:06',1,1,2),(341,44,'ekis\n','2018-04-02 15:02:08',1,1,1),(342,44,'sd','2018-04-02 15:11:55',1,1,1),(343,44,'sd','2018-04-02 15:12:04',1,1,1),(344,44,'ss','2018-04-02 15:12:11',1,1,1),(345,45,'asd','2018-04-02 15:12:35',1,1,2),(346,44,'d','2018-04-02 15:12:44',1,1,1),(347,45,'asd','2018-04-02 15:12:57',1,1,1),(348,46,'eksdi\r\n','2018-04-02 15:29:15',1,1,2),(349,47,'asd','2018-04-02 16:14:54',1,1,2),(350,47,'s','2018-04-02 16:57:24',1,1,2),(351,47,'s','2018-04-02 16:57:26',1,1,2),(352,47,'','2018-04-02 16:57:27',1,1,2),(353,47,'s','2018-04-02 16:57:28',1,1,2),(354,47,'s','2018-04-02 16:57:29',1,1,2),(355,47,'s','2018-04-02 16:57:30',1,1,2),(356,47,'sd','2018-04-02 16:57:31',1,1,2),(357,47,'asd','2018-04-02 16:57:32',1,1,2),(358,47,'asd','2018-04-02 16:57:34',1,1,2),(359,47,'sss','2018-04-02 16:58:50',1,1,2),(360,47,'sdf','2018-04-02 16:59:27',1,1,2),(361,47,'lesgo\nf','2018-04-02 17:00:55',1,1,2),(362,44,'-- has CANCELLED this chat and its transaction.','2018-04-02 17:17:05',0,1,2),(363,46,'-- has CANCELLED this chat and its transaction.','2018-04-02 17:17:40',1,1,2),(364,45,'-- has CANCELLED this chat and its transaction.','2018-04-02 17:17:43',1,1,2),(365,47,'asd','2018-04-02 17:30:35',1,1,2),(366,47,'s','2018-04-02 17:30:46',1,1,2),(367,47,'Sdd','2018-04-02 17:31:13',1,1,2),(368,47,'a','2018-04-02 17:31:21',1,1,2),(369,48,'sad','2018-04-02 21:31:18',1,1,2),(370,48,'-- I have created an invoice, check it out on the upper right corner!','2018-04-02 23:24:10',1,0,1);

--
-- Table structure for table `tblrating`
--

DROP TABLE IF EXISTS `tblrating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblrating` (
  `intRateID` int(11) NOT NULL AUTO_INCREMENT,
  `intRatedAccNo` int(9) NOT NULL COMMENT 'FK',
  `intRateTransID` int(11) NOT NULL COMMENT 'FK',
  `intRating` int(1) NOT NULL,
  `datRateDate` date NOT NULL,
  `txtRateReview` text,
  PRIMARY KEY (`intRateID`),
  KEY `intRatedAccNo_idx` (`intRatedAccNo`),
  KEY `intRateTransID_idx` (`intRateTransID`),
  CONSTRAINT `intRateTransID` FOREIGN KEY (`intRateTransID`) REFERENCES `tbltransaction` (`intTransID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intRatedAccNo` FOREIGN KEY (`intRatedAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblrating`
--

INSERT INTO `tblrating` VALUES (1,1,20,5,'2018-03-02','asdfghj'),(2,1,19,4,'2018-03-02','asdasd'),(3,2,21,3,'2018-03-02','asd'),(4,4,22,4,'2018-03-02','asd'),(5,1,22,5,'2018-03-02',''),(6,7,19,5,'2018-03-02','asd'),(7,1,23,5,'2018-03-02','asd'),(8,2,20,5,'2018-03-13',''),(9,4,23,5,'2018-03-13','asdasdd'),(10,1,21,5,'2018-03-14','1234567'),(11,1,45,5,'2018-04-02','xx'),(12,12,45,5,'2018-04-02','xx');

--
-- Table structure for table `tblreport`
--

DROP TABLE IF EXISTS `tblreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreport` (
  `intRepID` int(11) NOT NULL AUTO_INCREMENT,
  `intRepedAccNo` int(9) NOT NULL COMMENT 'FK',
  `intReporterAccNo` int(9) NOT NULL,
  `intRepTransID` int(11) DEFAULT NULL COMMENT 'FK',
  `intRepChatID` int(11) DEFAULT NULL,
  `intRepCategory` int(1) NOT NULL,
  `txtRepDesc` text,
  `datRepDate` date NOT NULL,
  `intRepStatus` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intRepID`),
  KEY `intRepedAccNo_idx` (`intRepedAccNo`),
  KEY `intRepTransID_idx` (`intRepTransID`),
  KEY `intRepChatID_idx` (`intRepChatID`),
  KEY `intReporterAccNo_idx` (`intReporterAccNo`),
  CONSTRAINT `intRepChatID` FOREIGN KEY (`intRepChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intRepTransID` FOREIGN KEY (`intRepTransID`) REFERENCES `tbltransaction` (`intTransID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intRepedAccNo` FOREIGN KEY (`intRepedAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intReporterAccNo` FOREIGN KEY (`intReporterAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreport`
--

INSERT INTO `tblreport` VALUES (1,1,2,NULL,NULL,1,'wala lang','2018-04-02',1),(2,3,4,NULL,NULL,2,'ewan ko ba','2018-04-03',1),(3,4,2,NULL,NULL,1,'trip trip','2018-04-03',1),(4,12,1,NULL,NULL,2,'haked me','2018-04-02',1);

--
-- Table structure for table `tblschedule`
--

DROP TABLE IF EXISTS `tblschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblschedule` (
  `intSchedID` int(11) NOT NULL AUTO_INCREMENT,
  `intSchedAccNo` int(9) NOT NULL,
  `strSchedDay` varchar(10) NOT NULL,
  `tmSchedStart` time NOT NULL,
  `tmSchedEnd` time NOT NULL,
  PRIMARY KEY (`intSchedID`),
  KEY `intSchedAccNo_idx` (`intSchedAccNo`),
  CONSTRAINT `intSchedAccNo` FOREIGN KEY (`intSchedAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblschedule`
--

INSERT INTO `tblschedule` VALUES (1,1,'Friday','10:00:00','19:00:00'),(3,1,'Thursday','06:15:00','09:00:00'),(7,1,'Wednesday','12:00:00','20:45:00'),(14,1,'Tuesday','00:00:00','13:45:00'),(15,1,'Saturday','00:15:00','00:00:00'),(17,1,'Sunday','03:00:00','05:15:00'),(19,7,'Sunday','10:30:00','18:30:00'),(20,7,'Monday','07:00:00','18:30:00'),(21,7,'Tuesday','06:00:00','15:45:00'),(22,4,'Sunday','00:00:00','00:00:00'),(23,4,'Monday','00:00:00','00:00:00'),(24,4,'Tuesday','00:00:00','00:30:00');

--
-- Table structure for table `tblservice`
--

DROP TABLE IF EXISTS `tblservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblservice` (
  `intServID` int(11) NOT NULL AUTO_INCREMENT,
  `intServTag` int(3) NOT NULL COMMENT 'FK',
  `intServAccNo` int(9) NOT NULL COMMENT 'FK',
  `intServStatus` int(1) NOT NULL,
  `intPriceType` int(1) NOT NULL,
  `fltPrice` float NOT NULL,
  PRIMARY KEY (`intServID`),
  KEY `intServAccNo_idx` (`intServAccNo`),
  KEY `intServTag_idx` (`intServTag`),
  CONSTRAINT `intServAccNo` FOREIGN KEY (`intServAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intServTag` FOREIGN KEY (`intServTag`) REFERENCES `tblservicetag` (`intServTagID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservice`
--

INSERT INTO `tblservice` VALUES (1,1,1,1,2,72.5),(3,2,1,0,1,32),(5,3,5,1,2,72),(6,3,1,1,2,50),(7,3,2,2,1,60),(29,5,1,1,1,213),(30,4,1,1,2,45),(32,4,2,2,1,1245),(33,2,2,2,2,55),(34,5,2,2,2,120),(35,1,3,1,1,123),(36,1,7,1,1,113),(37,1,4,1,1,200),(38,6,1,1,2,50),(39,3,4,1,1,1231),(40,2,7,1,1,70),(41,12,9,1,1,320),(42,2,12,1,1,150),(43,1,8,1,1,234),(44,1,5,1,1,188);

--
-- Table structure for table `tblservicetag`
--

DROP TABLE IF EXISTS `tblservicetag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblservicetag` (
  `intServTagID` int(3) NOT NULL AUTO_INCREMENT,
  `strServName` varchar(45) NOT NULL,
  PRIMARY KEY (`intServTagID`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservicetag`
--

INSERT INTO `tblservicetag` VALUES (1,'Plumber'),(2,'Electrician'),(3,'Technician'),(4,'Laundry'),(5,'Carpenter'),(6,'Tutor'),(7,'Physical Therapist'),(8,'Dentist'),(9,'Manicurist'),(10,'Babysitter'),(11,'Housekeeper'),(12,'Pest Control'),(13,'Gardener'),(14,'Driver'),(15,'Cook'),(16,'Masseuse');

--
-- Table structure for table `tblspecialsched`
--

DROP TABLE IF EXISTS `tblspecialsched`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblspecialsched` (
  `intSpecialID` int(11) NOT NULL AUTO_INCREMENT,
  `intSpecialAccNo` int(9) NOT NULL,
  `datSpecialDate` date NOT NULL,
  `tmSpecialStart` time DEFAULT NULL,
  `tmSpecialEnd` time DEFAULT NULL,
  PRIMARY KEY (`intSpecialID`),
  KEY `intSpecialAccNo_idx` (`intSpecialAccNo`),
  CONSTRAINT `intSpecialAccNo` FOREIGN KEY (`intSpecialAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblspecialsched`
--

INSERT INTO `tblspecialsched` VALUES (2,1,'2018-03-02','02:30:00','14:45:00'),(3,1,'2017-01-01','10:00:00','10:00:00'),(4,1,'2018-01-01','00:00:00','00:00:00'),(9,1,'2018-03-30',NULL,NULL),(11,1,'2018-09-01','13:15:00','00:30:00'),(13,1,'2018-02-23','00:00:00','00:00:00'),(17,1,'2018-02-24','12:00:00','00:00:00'),(19,1,'2018-02-26',NULL,NULL),(20,4,'2018-02-25','12:30:00','20:00:00'),(21,4,'2018-02-27',NULL,NULL);

--
-- Table structure for table `tblsuspension`
--

DROP TABLE IF EXISTS `tblsuspension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblsuspension` (
  `intSuspendID` int(11) NOT NULL AUTO_INCREMENT,
  `intSuspendAccNo` int(9) NOT NULL,
  `intSuspendCancelID` int(11) NOT NULL,
  `datSuspendDate` date NOT NULL,
  PRIMARY KEY (`intSuspendID`),
  KEY `intSuspendAccNo_idx` (`intSuspendAccNo`),
  KEY `intSuspendCancelID_idx` (`intSuspendCancelID`),
  CONSTRAINT `intSuspendAccNo` FOREIGN KEY (`intSuspendAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intSuspendCancelID` FOREIGN KEY (`intSuspendCancelID`) REFERENCES `tblcancellation` (`intCancelID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsuspension`
--


--
-- Table structure for table `tbltransaction`
--

DROP TABLE IF EXISTS `tbltransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbltransaction` (
  `intTransID` int(11) NOT NULL AUTO_INCREMENT,
  `intTransChatID` int(11) NOT NULL COMMENT 'FK',
  `intTransPriceType` int(1) NOT NULL,
  `fltTransPrice` float NOT NULL,
  `intTransStatus` int(1) NOT NULL DEFAULT '0',
  `dtmTransStarted` datetime DEFAULT NULL,
  `dtmTransScheduled` datetime NOT NULL,
  `dtmTransEnded` datetime DEFAULT NULL,
  PRIMARY KEY (`intTransID`),
  KEY `intTransChatID_idx` (`intTransChatID`),
  CONSTRAINT `intTransChatID` FOREIGN KEY (`intTransChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbltransaction`
--

INSERT INTO `tbltransaction` VALUES (19,26,2,55,2,'2018-02-27 15:15:28','2018-03-01 00:15:00','2018-03-02 01:45:38'),(20,27,1,1245,2,'2018-03-02 01:44:30','2018-05-27 00:00:00','2018-03-02 01:44:47'),(21,28,2,72.5,2,'2018-03-02 02:43:38','2018-06-01 00:00:00','2018-03-02 02:43:50'),(22,29,2,72.5,2,'2018-03-02 03:01:58','2018-09-01 00:00:00','2018-03-02 03:02:13'),(23,30,1,200,2,'2018-03-02 05:10:02','2018-05-01 00:00:00','2018-03-02 05:10:13'),(43,36,1,150,3,'2018-04-01 22:46:05','2019-01-01 00:00:00',NULL),(44,37,1,150,3,'2018-04-01 22:59:41','2018-04-02 00:45:00',NULL),(45,38,1,150,2,'2018-04-02 00:31:55','2019-05-01 00:00:00','2018-04-02 02:31:40'),(46,31,1,123,3,NULL,'2019-01-01 00:00:00',NULL),(47,48,1,150,0,NULL,'2018-06-01 00:00:00',NULL);

--
-- Table structure for table `tbltransworkers`
--

DROP TABLE IF EXISTS `tbltransworkers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbltransworkers` (
  `intTWID` int(11) NOT NULL AUTO_INCREMENT,
  `intTWTransID` int(11) NOT NULL,
  `intTWWorkerID` int(11) NOT NULL,
  PRIMARY KEY (`intTWID`),
  KEY `intTWTransID_idx` (`intTWTransID`),
  KEY `intTWWorkerID_idx` (`intTWWorkerID`),
  CONSTRAINT `intTWTransID` FOREIGN KEY (`intTWTransID`) REFERENCES `tbltransaction` (`intTransID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intTWWorkerID` FOREIGN KEY (`intTWWorkerID`) REFERENCES `tblworker` (`intWorkerID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbltransworkers`
--

INSERT INTO `tbltransworkers` VALUES (20,43,1),(21,43,2),(22,43,3),(23,44,1),(24,44,2),(25,44,3),(26,45,1);

--
-- Table structure for table `tbluser`
--

DROP TABLE IF EXISTS `tbluser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbluser` (
  `intAccNo` int(9) NOT NULL AUTO_INCREMENT,
  `strName` varchar(100) NOT NULL,
  `strUserName` varchar(50) NOT NULL,
  `strPassword` varchar(100) NOT NULL,
  `intType` int(1) NOT NULL,
  `intStatus` int(1) NOT NULL,
  `strCity` varchar(45) NOT NULL,
  `strBarangay` varchar(45) NOT NULL,
  `strEmail` varchar(320) NOT NULL,
  `strContactNo` varchar(11) NOT NULL,
  `boolIsBanned` tinyint(4) NOT NULL DEFAULT '0',
  `strOwner` varchar(100) DEFAULT NULL,
  `strProfilePic` varchar(45) NOT NULL DEFAULT 'unknown.jpg',
  `strValidID` varchar(45) DEFAULT NULL,
  `intAutoFill` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intAccNo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tbluser` VALUES (1,'Jon Ervin Balmaceda','Jon-Ervin','0424',2,2,'Pasig','Rosario','balmacedajonervin@gmail.com','09236835707',0,NULL,'DP-000000001.jpg','VID-000000001.jpg',0),(2,'Ralf Milan','9Weissss','ralfralf',2,1,'Quezon','Tandang Sora','ralf@milan.com','09234545672',0,NULL,'DP-000000002.jpg',NULL,0),(3,'Piolo Sales','Sno-weak','piolopiolo',2,1,'Manila','Espana','Piolo@mahina.com','0923893482',0,NULL,'unknown.jpg',NULL,0),(4,'Vince Oreta','VinceIRL','vincevince',2,2,'Pasig','San Joaquin','vince@dead.com','09236754551',0,NULL,'DP-000000004.jpg',NULL,0),(5,'Carlo Doronila','CarloDoronichan','carlocarlo',2,1,'Manila','Sta. Mesa','carlo@anime.com','09234545676',0,NULL,'DP-000000005.jpg',NULL,1),(6,'admin','admin','admin',1,1,'Manila','Tondo','admin@admin.com','09236835707',0,NULL,'unknown.jpg',NULL,1),(7,'Homer Cadena','ricknmorty','homerhomer',2,2,'Quezon','Tandang Sora','homer@gmail.com','09235458097',0,NULL,'DP-000000007.jpg','VID-000000007.jpg',0),(8,'John Carlos Pagaduan','Elitebuild','pagapaga',2,1,'Manila','Sta. Mesa','jc@gmail.com','09236545346',0,NULL,'DP-000000008.jpg','VID-000000008.jpg',0),(9,'21 Construction','21construction','21construction',3,2,'Manila','Sta. Mesa','jeth@gmail.com','09235645238',0,'Jethro Samson','unknown.jpg','BP-000000000.jpg',1),(10,'Plumbing Corporation','PlumCorp','PlumCorp',3,2,'Quezon','Tandang Sora','lance@gmail.com','09235647389',0,'Lance San Pablo','unknown.jpg','BP-PlumCorp.jpg',1),(12,'ComptonCrips','ComptonCrips','ComptonCrips',3,2,'Manila','Tondo','ComptonCrips@gmail.com','09236835707',0,'Kodak White','DP-000000012.jpg','BP-ComptonCrips.jpg',0);

--
-- Table structure for table `tblworker`
--

DROP TABLE IF EXISTS `tblworker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblworker` (
  `intWorkerID` int(11) NOT NULL AUTO_INCREMENT,
  `intWorkBusID` int(9) NOT NULL,
  `intWorkerTrans` int(11) DEFAULT NULL,
  `strWorker` varchar(100) NOT NULL,
  `intWorkerStatus` int(1) NOT NULL DEFAULT '1',
  `strWorkerID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intWorkerID`),
  KEY `intWorkBusID_idx` (`intWorkBusID`),
  CONSTRAINT `intWorkBusID` FOREIGN KEY (`intWorkBusID`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblworker`
--

INSERT INTO `tblworker` VALUES (1,12,47,'Homer \"Batang Tanga\"',1,NULL),(2,12,NULL,'Carlong Malungkot',0,NULL),(3,12,NULL,'Hayup ka Joaquin!',1,NULL),(4,9,NULL,'Homer',1,'WID-000000009-ntKlc9uwq9LfbaswaJWzRRiPu.jpg'),(5,9,NULL,'Vince',1,'WID-000000009-GC1mmrAU4KRvZmHh1Y4qlfpQK.jpg');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
