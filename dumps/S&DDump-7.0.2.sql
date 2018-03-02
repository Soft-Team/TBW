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
  `dtmCancelDate` datetime NOT NULL,
  `txtCancelReason` text NOT NULL,
  `intHidden` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`intCancelID`),
  KEY `intCancelChatID_idx` (`intCancelChatID`),
  CONSTRAINT `intCancelChatID` FOREIGN KEY (`intCancelChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcancellation`
--

INSERT INTO `tblcancellation` VALUES (1,30,'2018-03-02 05:02:47','x',0),(2,30,'2018-03-02 05:09:01','saf',0);

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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblchat`
--

INSERT INTO `tblchat` VALUES (26,1,36,0),(27,1,32,0),(28,2,1,0),(29,4,1,0),(30,1,37,0);

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbldocument`
--

INSERT INTO `tbldocument` VALUES (6,1,'DOC-000000001PEYBicYW5W8heo1H3khpg8PVIjnExc.jpg'),(7,1,'DOC-000000001apw5n14BuThXYMqgwL4NyOvMWeKkmF.jpg'),(8,1,'DOC-000000001qhbSGAKTUvLPBwGcpkXOzcD2MGgou0.jpg');

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
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblmessage`
--

INSERT INTO `tblmessage` VALUES (161,26,'hm cyst\r\n','2018-02-27 15:12:01',1,1,2),(162,26,'pm sent','2018-02-27 15:14:19',1,1,1),(163,26,'-- I have created an invoice, check it out on the upper right corner!','2018-02-27 15:14:50',1,1,1),(164,26,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-02-27 15:15:28',1,1,1),(165,27,'xxxx','2018-03-02 01:22:37',1,1,2),(166,26,'a','2018-03-02 01:25:11',1,1,2),(167,27,'-- I have created an invoice, check it out on the upper right corner!','2018-03-02 01:44:22',1,1,1),(168,27,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-03-02 01:44:30',0,1,1),(169,28,'sad','2018-03-02 02:43:18',1,1,2),(170,28,'-- I have created an invoice, check it out on the upper right corner!','2018-03-02 02:43:33',1,1,1),(171,28,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-03-02 02:43:38',1,1,1),(172,29,'x','2018-03-02 03:01:39',1,1,2),(173,29,'-- I have created an invoice, check it out on the upper right corner!','2018-03-02 03:01:50',1,1,1),(174,29,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-03-02 03:01:58',1,1,1),(175,30,'x','2018-03-02 04:56:52',1,1,2),(176,30,'-- has CANCELLED this chat and its transaction.','2018-03-02 05:02:47',1,1,1),(177,30,'-- has CANCELLED this chat and its transaction.','2018-03-02 05:09:01',1,1,2),(178,30,'asd','2018-03-02 05:09:25',1,1,2),(179,30,'-- I have created an invoice, check it out on the upper right corner!','2018-03-02 05:09:55',1,1,1),(180,30,'-- I have ACCEPTED your offer, transaction is now ONGOING !','2018-03-02 05:10:02',1,1,1),(181,30,'-- transaction has FINISHED','2018-03-02 05:10:13',1,1,1);

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblrating`
--

INSERT INTO `tblrating` VALUES (1,1,20,5,'2018-03-02','asdfghj'),(2,1,19,4,'2018-03-02','asdasd'),(3,2,21,3,'2018-03-02','asd'),(4,4,22,4,'2018-03-02','asd'),(5,1,22,5,'2018-03-02',''),(6,7,19,5,'2018-03-02','asd'),(7,1,23,5,'2018-03-02','asd');

--
-- Table structure for table `tblreport`
--

DROP TABLE IF EXISTS `tblreport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreport` (
  `intRepID` int(11) NOT NULL AUTO_INCREMENT,
  `intRepedAccNo` int(9) NOT NULL COMMENT 'FK',
  `intRepTransID` int(11) DEFAULT NULL COMMENT 'FK',
  `intRepChatID` int(11) DEFAULT NULL,
  `intRepCategory` int(1) NOT NULL,
  `txtRepDesc` text,
  `datRepDate` date NOT NULL,
  `intRepHidden` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`intRepID`),
  KEY `intRepedAccNo_idx` (`intRepedAccNo`),
  KEY `intRepTransID_idx` (`intRepTransID`),
  KEY `intRepChatID_idx` (`intRepChatID`),
  CONSTRAINT `intRepChatID` FOREIGN KEY (`intRepChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intRepTransID` FOREIGN KEY (`intRepTransID`) REFERENCES `tbltransaction` (`intTransID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intRepedAccNo` FOREIGN KEY (`intRepedAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreport`
--


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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservice`
--

INSERT INTO `tblservice` VALUES (1,1,1,1,2,72.5),(3,2,1,0,1,32),(5,3,5,1,2,72),(6,3,1,1,2,50),(7,3,2,1,1,60),(29,5,1,1,1,213),(30,4,1,1,2,45),(32,4,2,1,1,1245),(33,2,2,1,2,55),(34,5,2,1,2,120),(35,1,3,1,1,123),(36,1,7,1,1,113),(37,1,4,1,1,200),(38,6,1,1,2,50),(39,3,4,1,1,1231);

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservicetag`
--

INSERT INTO `tblservicetag` VALUES (1,'Plumbing'),(2,'Electrician'),(3,'Technician'),(4,'Laundry'),(5,'Carpenter'),(6,'Tutor');

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

INSERT INTO `tblspecialsched` VALUES (2,1,'2018-03-02','02:30:00','14:45:00'),(3,1,'2017-01-01','10:00:00','10:00:00'),(4,1,'2018-01-01','00:00:00','00:00:00'),(9,1,'2018-06-13',NULL,NULL),(11,1,'2018-09-01','13:15:00','00:30:00'),(13,1,'2018-02-23','00:00:00','00:00:00'),(17,1,'2018-02-24','12:00:00','00:00:00'),(19,1,'2018-02-26',NULL,NULL),(20,4,'2018-02-25','12:30:00','20:00:00'),(21,4,'2018-02-27',NULL,NULL);

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
  `txtTransCancelDesc` text,
  PRIMARY KEY (`intTransID`),
  KEY `intTransChatID_idx` (`intTransChatID`),
  CONSTRAINT `intTransChatID` FOREIGN KEY (`intTransChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbltransaction`
--

INSERT INTO `tbltransaction` VALUES (19,26,2,55,2,'2018-02-27 15:15:28','2018-03-01 00:15:00','2018-03-02 01:45:38',NULL),(20,27,1,1245,2,'2018-03-02 01:44:30','2018-05-27 00:00:00','2018-03-02 01:44:47',NULL),(21,28,2,72.5,2,'2018-03-02 02:43:38','2018-06-01 00:00:00','2018-03-02 02:43:50',NULL),(22,29,2,72.5,2,'2018-03-02 03:01:58','2018-09-01 00:00:00','2018-03-02 03:02:13',NULL),(23,30,1,200,2,'2018-03-02 05:10:02','2018-05-01 00:00:00','2018-03-02 05:10:13',NULL);

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
  PRIMARY KEY (`intAccNo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tbluser` VALUES (1,'Jon Ervin Balmaceda','Jon-Ervin','0424',2,2,'Pasig','Rosario','balmacedajonervin@gmail.com','09236835707',0,NULL,'DP-000000001.jpg','VID-000000001.jpg'),(2,'Ralf Milan','9Weissss','ralfralf',2,1,'Quezon','Tandang Sora','ralf@milan.com','09234545672',0,NULL,'DP-000000002.jpg',NULL),(3,'Piolo Sales','Sno-weak','piolopiolo',2,2,'Manila','Espana','Piolo@mahina.com','0923893482',0,NULL,'unknown.jpg',NULL),(4,'Vince Oreta','VinceIRL','vincevince',2,2,'Pasig','San Joaquin','vince@dead.com','09236754551',0,NULL,'unknown.jpg',NULL),(5,'Carlo Doronila','CarloDoronichan','carlocarlo',2,1,'Manila','Sta. Mesa','carlo@anime.com','09234545676',1,NULL,'unknown.jpg',NULL),(6,'admin','admin','admin',1,1,'Manila','Tondo','admin@admin.com','09236835707',0,NULL,'unknown.jpg',NULL),(7,'Homer Cadena','ricknmorty','homerhomer',2,2,'Quezon','Tandang Sora','homer@gmail.com','09235458097',0,NULL,'unknown.jpg',NULL),(8,'John Carlos Pagaduan','Elitebuild','pagapaga',2,1,'Manila','Sta. Mesa','jc@gmail.com','09236545346',0,NULL,'unknown.jpg',NULL),(9,'21 Construction','21construction','21construction',3,2,'Manila','Sta. Mesa','jeth@gmail.com','09235645238',0,'Jethro Samson','unknown.jpg','BP-000000000.jpg'),(10,'Plumbing Corporation','PlumCorp','PlumCorp',3,2,'Quezon','Tandang Sora','lance@gmail.com','09235647389',1,'Lance San Pablo','unknown.jpg','BP-PlumCorp.jpg');

--
-- Table structure for table `tblworker`
--

DROP TABLE IF EXISTS `tblworker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblworker` (
  `intWorkerID` int(11) NOT NULL AUTO_INCREMENT,
  `intWorkBusID` int(9) NOT NULL,
  `strWorker` varchar(45) NOT NULL,
  PRIMARY KEY (`intWorkerID`),
  KEY `intWorkBusID_idx` (`intWorkBusID`),
  CONSTRAINT `intWorkBusID` FOREIGN KEY (`intWorkBusID`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblworker`
--


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
