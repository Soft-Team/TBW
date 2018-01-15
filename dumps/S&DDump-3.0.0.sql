CREATE DATABASE  IF NOT EXISTS `dbtrabawho` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `dbtrabawho`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: dbtrabawho
-- ------------------------------------------------------
-- Server version	5.7.19-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblbusiness`
--

DROP TABLE IF EXISTS `tblbusiness`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblbusiness` (
  `intBusinessID` int(11) NOT NULL AUTO_INCREMENT,
  `intBusAccNo` int(9) NOT NULL,
  `strBusOwner` varchar(45) NOT NULL,
  PRIMARY KEY (`intBusinessID`),
  KEY `intBusAccNo_idx` (`intBusAccNo`),
  CONSTRAINT `intBusAccNo` FOREIGN KEY (`intBusAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbusiness`
--


--
-- Table structure for table `tblchat`
--

DROP TABLE IF EXISTS `tblchat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblchat` (
  `intChatID` int(11) NOT NULL AUTO_INCREMENT,
  `intChatUser1` int(9) NOT NULL COMMENT 'FK',
  `intChatUser2` int(9) NOT NULL COMMENT 'FK',
  `intChatServTag` int(3) NOT NULL COMMENT 'FK',
  PRIMARY KEY (`intChatID`),
  KEY `intUser1_idx` (`intChatUser1`),
  KEY `intUser2_idx` (`intChatUser2`),
  KEY `intChatServTag_idx` (`intChatServTag`),
  CONSTRAINT `intChatServTag` FOREIGN KEY (`intChatServTag`) REFERENCES `tblservicetag` (`intServTagID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intUser1` FOREIGN KEY (`intChatUser1`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intUser2` FOREIGN KEY (`intChatUser2`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblchat`
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
  PRIMARY KEY (`intMessID`),
  KEY `intMessChatID_idx` (`intMessChatID`),
  CONSTRAINT `intMessChatID` FOREIGN KEY (`intMessChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblmessage`
--


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
  `intRepTransID` int(11) NOT NULL COMMENT 'FK',
  `intRepCategory` int(1) NOT NULL,
  `txtRepDesc` text,
  `datRepDate` date NOT NULL,
  PRIMARY KEY (`intRepID`),
  KEY `intRepedAccNo_idx` (`intRepedAccNo`),
  KEY `intRepTransID_idx` (`intRepTransID`),
  CONSTRAINT `intRepTransID` FOREIGN KEY (`intRepTransID`) REFERENCES `tbltransaction` (`intTransID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intRepedAccNo` FOREIGN KEY (`intRepedAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreport`
--


--
-- Table structure for table `tblrequest`
--

DROP TABLE IF EXISTS `tblrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblrequest` (
  `intReqID` int(11) NOT NULL AUTO_INCREMENT,
  `intReqAccNo` int(9) NOT NULL COMMENT 'FK',
  `strReqValidID` varchar(45) NOT NULL,
  `datReqDate` date NOT NULL,
  `intReqResponse` int(1) NOT NULL,
  PRIMARY KEY (`intReqID`),
  KEY `intReqAccNo_idx` (`intReqAccNo`),
  CONSTRAINT `intReqAccNo` FOREIGN KEY (`intReqAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblrequest`
--


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
  `fltPrice` float DEFAULT NULL,
  PRIMARY KEY (`intServID`),
  KEY `intServAccNo_idx` (`intServAccNo`),
  KEY `intServTag_idx` (`intServTag`),
  CONSTRAINT `intServAccNo` FOREIGN KEY (`intServAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `intServTag` FOREIGN KEY (`intServTag`) REFERENCES `tblservicetag` (`intServTagID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservice`
--

INSERT INTO `tblservice` VALUES (1,1,1,1,1,70),(2,1,3,1,1,64),(3,1,4,1,0,NULL),(4,1,2,0,2,80),(5,3,5,1,2,72),(6,3,1,1,1,50),(7,3,2,1,0,NULL),(17,4,1,1,0,NULL),(18,5,1,1,2,100);

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
  `datSReqDate` date NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservicetag`
--

INSERT INTO `tblservicetag` VALUES (1,'Plumbing'),(2,'Electrician'),(3,'Technician'),(4,'Laundry'),(5,'Carpenter');

--
-- Table structure for table `tblservidreq`
--

DROP TABLE IF EXISTS `tblservidreq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblservidreq` (
  `intSIRID` int(11) NOT NULL AUTO_INCREMENT,
  `intSIRServID` int(11) NOT NULL,
  `strSIRLicense` varchar(45) DEFAULT NULL,
  `strSIRCertificate` varchar(45) DEFAULT NULL,
  `datSIRDate` date NOT NULL,
  `intSIRResponse` int(11) NOT NULL,
  PRIMARY KEY (`intSIRID`),
  KEY `intSIRServID_idx` (`intSIRServID`),
  CONSTRAINT `intSIRServID` FOREIGN KEY (`intSIRServID`) REFERENCES `tblservice` (`intServID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservidreq`
--


--
-- Table structure for table `tblservlicense`
--

DROP TABLE IF EXISTS `tblservlicense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblservlicense` (
  `intServLicenseID` int(11) NOT NULL AUTO_INCREMENT,
  `intSLServID` int(11) NOT NULL,
  `strSLCertificate` varchar(45) DEFAULT NULL,
  `strSLLicense` varchar(45) DEFAULT NULL,
  `datSLExpiration` date DEFAULT NULL,
  PRIMARY KEY (`intServLicenseID`),
  KEY `intSLServID_idx` (`intSLServID`),
  CONSTRAINT `intSLServID` FOREIGN KEY (`intSLServID`) REFERENCES `tblservice` (`intServID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblservlicense`
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
  `datTransStarted` date NOT NULL,
  `datTransScheduled` date NOT NULL,
  `datTransEnded` date DEFAULT NULL,
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
  `txtUserDesc` text,
  `strProfilePic` varchar(45) DEFAULT NULL,
  `strValidID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intAccNo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tbluser` VALUES (1,'Jon Ervin Balmaceda','Jon-Ervin','0424',2,1,'Pasig','Rosario','balmacedajonervin@gmail.com','09236835707',NULL,NULL,NULL),(2,'Ralf Milan','9Weissss','ralfralf',2,1,'Quezon','Tandang Sora','ralf@milan.com','09234545672',NULL,NULL,NULL),(3,'Piolo Sales','Sno-weak','piolopiolo',2,1,'Manila','Espana','Piolo@mahina.com','0923893482',NULL,NULL,NULL),(4,'Vince Oreta','VinceIRL','vincevince',2,1,'Pasig','San Joaquin','vince@dead.com','09236754551',NULL,NULL,NULL),(5,'Carlo Doronila','CarloDoronichan','carlocarlo',2,1,'Manila','Sta. Mesa','carlo@anime.com','09234545676',NULL,NULL,NULL),(6,'admin','admin','admin',1,1,'Manila','Tondo','admin@admin.com','09236835707',NULL,NULL,NULL);

--
-- Table structure for table `tblworker`
--

DROP TABLE IF EXISTS `tblworker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblworker` (
  `intWorkerID` int(11) NOT NULL AUTO_INCREMENT,
  `intWorkBusID` int(11) NOT NULL,
  `strWorker` varchar(45) NOT NULL,
  PRIMARY KEY (`intWorkerID`),
  KEY `intWorkBusID_idx` (`intWorkBusID`),
  CONSTRAINT `intWorkBusID` FOREIGN KEY (`intWorkBusID`) REFERENCES `tblbusiness` (`intBusinessID`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
