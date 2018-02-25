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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcancellation`
--


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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblchat`
--

INSERT INTO `tblchat` VALUES (11,1,35,1),(12,1,36,1);

--
-- Table structure for table `tbldocument`
--

DROP TABLE IF EXISTS `tbldocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbldocument` (
  `intDocID` int(11) NOT NULL AUTO_INCREMENT,
  `intDocAccNo` int(9) NOT NULL,
  `intDocument` varchar(45) NOT NULL,
  PRIMARY KEY (`intDocID`),
  KEY `intDocAccNo_idx` (`intDocAccNo`),
  CONSTRAINT `intDocAccNo` FOREIGN KEY (`intDocAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbldocument`
--


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
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblmessage`
--

INSERT INTO `tblmessage` VALUES (97,11,'Help','2018-02-25 17:09:29',1,1,2),(98,12,'heelp','2018-02-25 17:11:08',1,1,2),(99,12,'heelp me','2018-02-25 17:11:08',1,1,1),(100,12,'x','2018-02-25 17:52:33',1,1,2),(101,12,'help meeeeeeee','2018-02-25 17:53:23',1,1,2),(102,12,'serve\n','2018-02-25 17:53:27',1,1,2),(103,12,'serve now','2018-02-25 17:53:30',1,1,2),(104,12,'no','2018-02-25 17:53:45',1,1,1),(105,12,'no no no','2018-02-25 17:53:49',1,1,1),(106,11,'yes','2018-02-25 17:54:17',1,1,1),(107,11,'okay\n','2018-02-25 17:54:20',1,1,1),(108,11,'yes yes','2018-02-25 17:54:24',1,1,1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblrating`
--


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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblschedule`
--

INSERT INTO `tblschedule` VALUES (1,1,'Friday','10:00:00','19:00:00'),(3,1,'Thursday','06:15:00','09:00:00'),(7,1,'Wednesday','12:00:00','20:45:00'),(14,1,'Tuesday','00:00:00','13:45:00'),(15,1,'Saturday','00:15:00','00:00:00'),(17,1,'Sunday','03:00:00','05:15:00'),(19,7,'Sunday','10:30:00','18:30:00'),(20,7,'Monday','07:00:00','18:30:00'),(21,7,'Tuesday','06:00:00','15:45:00');

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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservice`
--

INSERT INTO `tblservice` VALUES (1,1,1,1,2,72.5),(3,2,1,1,1,32),(5,3,5,1,2,72),(6,3,1,1,2,50),(7,3,2,1,1,60),(29,5,1,1,1,213),(30,4,1,1,2,45),(32,4,2,1,1,1245),(33,2,2,1,2,55),(34,5,2,1,2,120),(35,1,3,0,1,123),(36,1,7,0,1,113),(37,1,4,1,1,200);

--
-- Table structure for table `tblservicereq`
--

DROP TABLE IF EXISTS `tblservicereq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblservicereq` (
  `intServReqID` int(11) NOT NULL AUTO_INCREMENT,
  `intSReqServID` int(11) NOT NULL,
  `intSReqAccNo` int(9) NOT NULL,
  `intSReqSeen` int(1) NOT NULL,
  `intSReqResponse` int(1) NOT NULL,
  PRIMARY KEY (`intServReqID`),
  KEY `intSReqServID_idx` (`intSReqServID`),
  KEY `intSReqAccNo_idx` (`intSReqAccNo`),
  CONSTRAINT `intSReqAccNo` FOREIGN KEY (`intSReqAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intSReqServID` FOREIGN KEY (`intSReqServID`) REFERENCES `tblservice` (`intServID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservicereq`
--


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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblspecialsched`
--

INSERT INTO `tblspecialsched` VALUES (2,1,'2018-03-02','02:30:00','14:45:00'),(3,1,'2017-01-01','10:00:00','10:00:00'),(4,1,'2018-01-01','00:00:00','00:00:00'),(9,1,'2018-06-13',NULL,NULL),(10,1,'2018-08-02','00:00:00','00:00:00'),(11,1,'2018-09-01','13:15:00','00:30:00'),(13,1,'2018-02-23','00:00:00','00:00:00'),(17,1,'2018-02-24','12:00:00','00:00:00'),(19,1,'2018-02-26',NULL,NULL),(20,4,'2018-02-25','12:30:00','20:00:00');

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
  `intFinderAccNo` int(9) NOT NULL COMMENT 'FK',
  `intTransServID` int(11) NOT NULL COMMENT 'FK',
  `intTransStatus` int(1) NOT NULL,
  `dtmTransStarted` datetime NOT NULL,
  `dtmTransScheduled` datetime NOT NULL,
  `dtmTransEnded` datetime DEFAULT NULL,
  `txtTransCancelDesc` text,
  `intTransSeen` int(1) NOT NULL,
  PRIMARY KEY (`intTransID`),
  KEY `intFinderAccNo_idx` (`intFinderAccNo`),
  KEY `intTransServID_idx` (`intTransServID`),
  CONSTRAINT `intFinderAccNo` FOREIGN KEY (`intFinderAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intTransServID` FOREIGN KEY (`intTransServID`) REFERENCES `tblservice` (`intServID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbltransaction`
--


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
  `strProfilePic` varchar(45) DEFAULT NULL,
  `strValidID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intAccNo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tbluser` VALUES (1,'Jon Ervin Balmaceda','Jon-Ervin','0424',2,1,'Pasig','Rosario','balmacedajonervin@gmail.com','09236835707',0,NULL,NULL,NULL),(2,'Ralf Milan','9Weissss','ralfralf',2,1,'Quezon','Tandang Sora','ralf@milan.com','09234545672',0,NULL,NULL,NULL),(3,'Piolo Sales','Sno-weak','piolopiolo',2,1,'Manila','Espana','Piolo@mahina.com','0923893482',0,NULL,NULL,NULL),(4,'Vince Oreta','VinceIRL','vincevince',2,1,'Pasig','San Joaquin','vince@dead.com','09236754551',0,NULL,NULL,NULL),(5,'Carlo Doronila','CarloDoronichan','carlocarlo',2,1,'Manila','Sta. Mesa','carlo@anime.com','09234545676',1,NULL,NULL,NULL),(6,'admin','admin','admin',1,1,'Manila','Tondo','admin@admin.com','09236835707',0,NULL,NULL,NULL),(7,'Homer Cadena','ricknmorty','homerhomer',2,1,'Quezon','Tandang Sora','homer@gmail.com','09235458097',0,NULL,NULL,NULL),(8,'John Carlos Pagaduan','Elitebuild','pagapaga',2,1,'Manila','Sta. Mesa','jc@gmail.com','09236545346',0,NULL,NULL,NULL),(9,'21 Construction','21construction','21construction',3,2,'Manila','Sta. Mesa','jeth@gmail.com','09235645238',0,'Jethro Samson',NULL,'BP-000000000.jpg'),(10,'Plumbing Corporation','PlumCorp','PlumCorp',3,1,'Quezon','Tandang Sora','lance@gmail.com','09235647389',0,'Lance San Pablo',NULL,'BP-PlumCorp.jpg');

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
