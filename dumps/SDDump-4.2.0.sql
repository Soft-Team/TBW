-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 29, 2018 at 05:49 PM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbtrabawho`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblbusiness`
--

CREATE TABLE `tblbusiness` (
  `intBusinessID` int(11) NOT NULL,
  `intBusAccNo` int(9) NOT NULL,
  `strBusOwner` varchar(45) NOT NULL,
  `intBusAdSeen` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tblchat`
--

CREATE TABLE `tblchat` (
  `intChatID` int(11) NOT NULL,
  `intChatSeeker` int(9) NOT NULL COMMENT 'FK',
  `intChatServ` int(11) NOT NULL,
  `intChatStatus` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tblchat`
--

INSERT INTO `tblchat` (`intChatID`, `intChatSeeker`, `intChatServ`, `intChatStatus`) VALUES
(1, 2, 1, 1),
(2, 3, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbldocument`
--

CREATE TABLE `tbldocument` (
  `intDocID` int(11) NOT NULL,
  `intDocAccNo` int(9) NOT NULL,
  `intDocument` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tblmessage`
--

CREATE TABLE `tblmessage` (
  `intMessID` int(11) NOT NULL,
  `intMessChatID` int(11) NOT NULL COMMENT 'FK',
  `txtMessage` text NOT NULL,
  `dtmDateSent` datetime NOT NULL,
  `intMessSeen` int(1) NOT NULL,
  `intSender` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tblmessage`
--

INSERT INTO `tblmessage` (`intMessID`, `intMessChatID`, `txtMessage`, `dtmDateSent`, `intMessSeen`, `intSender`) VALUES
(1, 1, 'MessOne', '2018-01-28 00:00:00', 1, 1),
(2, 1, 'MessTwo', '2018-01-28 00:00:00', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `tblrating`
--

CREATE TABLE `tblrating` (
  `intRateID` int(11) NOT NULL,
  `intRatedAccNo` int(9) NOT NULL COMMENT 'FK',
  `intRateTransID` int(11) NOT NULL COMMENT 'FK',
  `intRating` int(1) NOT NULL,
  `datRateDate` date NOT NULL,
  `txtRateReview` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tblreport`
--

CREATE TABLE `tblreport` (
  `intRepID` int(11) NOT NULL,
  `intRepedAccNo` int(9) NOT NULL COMMENT 'FK',
  `intRepTransID` int(11) NOT NULL COMMENT 'FK',
  `intRepCategory` int(1) NOT NULL,
  `txtRepDesc` text,
  `datRepDate` date NOT NULL,
  `intRepAdSeen` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tblrequest`
--

CREATE TABLE `tblrequest` (
  `intReqID` int(11) NOT NULL,
  `intReqAccNo` int(9) NOT NULL COMMENT 'FK',
  `strReqValidID` varchar(45) NOT NULL,
  `intResponse` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tblservice`
--

CREATE TABLE `tblservice` (
  `intServID` int(11) NOT NULL,
  `intServTag` int(3) NOT NULL COMMENT 'FK',
  `intServAccNo` int(9) NOT NULL COMMENT 'FK',
  `intServStatus` int(1) NOT NULL,
  `intPriceType` int(1) NOT NULL,
  `fltPrice` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tblservice`
--

INSERT INTO `tblservice` (`intServID`, `intServTag`, `intServAccNo`, `intServStatus`, `intPriceType`, `fltPrice`) VALUES
(1, 1, 1, 1, 2, 70),
(3, 1, 4, 1, 1, 32),
(4, 1, 2, 1, 1, 78),
(5, 3, 5, 1, 2, 72),
(6, 3, 1, 0, 2, 50),
(7, 3, 2, 2, 2, 60),
(29, 5, 1, 1, 1, 213),
(30, 4, 1, 1, 2, 45),
(31, 2, 1, 1, 1, 665),
(32, 4, 2, 1, 1, 1245),
(33, 2, 2, 1, 2, 55),
(34, 5, 2, 1, 2, 120),
(35, 1, 3, 1, 1, 123),
(36, 1, 7, 1, 1, 113);

-- --------------------------------------------------------

--
-- Table structure for table `tblservicereq`
--

CREATE TABLE `tblservicereq` (
  `intServReqID` int(11) NOT NULL,
  `intSReqServID` int(11) NOT NULL,
  `intSReqAccNo` int(9) NOT NULL,
  `intSReqSeen` int(1) NOT NULL,
  `intSReqResponse` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tblservicetag`
--

CREATE TABLE `tblservicetag` (
  `intServTagID` int(3) NOT NULL,
  `strServName` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tblservicetag`
--

INSERT INTO `tblservicetag` (`intServTagID`, `strServName`) VALUES
(1, 'Plumbing'),
(2, 'Electrician'),
(3, 'Technician'),
(4, 'Laundry'),
(5, 'Carpenter');

-- --------------------------------------------------------

--
-- Table structure for table `tbltransaction`
--

CREATE TABLE `tbltransaction` (
  `intTransID` int(11) NOT NULL,
  `intFinderAccNo` int(9) NOT NULL COMMENT 'FK',
  `intTransServID` int(11) NOT NULL COMMENT 'FK',
  `intTransStatus` int(1) NOT NULL,
  `dtmTransStarted` datetime NOT NULL,
  `dtmTransScheduled` datetime NOT NULL,
  `dtmTransEnded` datetime DEFAULT NULL,
  `txtTransCancelDesc` text,
  `intTransSeen` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbluser`
--

CREATE TABLE `tbluser` (
  `intAccNo` int(9) NOT NULL,
  `strName` varchar(100) NOT NULL,
  `strUserName` varchar(50) NOT NULL,
  `strPassword` varchar(100) NOT NULL,
  `intType` int(1) NOT NULL,
  `intStatus` int(1) NOT NULL,
  `strCity` varchar(45) NOT NULL,
  `strBarangay` varchar(45) NOT NULL,
  `strEmail` varchar(320) NOT NULL,
  `boolIsBanned` tinyint(4) NOT NULL DEFAULT '0',
  `strContactNo` varchar(11) NOT NULL,
  `strProfilePic` varchar(45) DEFAULT NULL,
  `strValidID` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbluser`
--

INSERT INTO `tbluser` (`intAccNo`, `strName`, `strUserName`, `strPassword`, `intType`, `intStatus`, `strCity`, `strBarangay`, `strEmail`, `boolIsBanned`, `strContactNo`, `strProfilePic`, `strValidID`) VALUES
(1, 'Jon Ervin Balmaceda', 'Jon-Ervin', '0424', 2, 1, 'Pasig', 'Rosario', 'balmacedajonervin@gmail.com', 1, '09236835707', NULL, NULL),
(2, 'Ralf Milan', '9Weissss', 'ralfralf', 2, 1, 'Quezon', 'Tandang Sora', 'ralf@milan.com', 0, '09234545672', NULL, NULL),
(3, 'Piolo Sales', 'Sno-weak', 'piolopiolo', 2, 1, 'Manila', 'Espana', 'Piolo@mahina.com', 1, '0923893482', NULL, NULL),
(4, 'Vince Oreta', 'VinceIRL', 'vincevince', 2, 1, 'Pasig', 'San Joaquin', 'vince@dead.com', 0, '09236754551', NULL, NULL),
(5, 'Carlo Doronila', 'CarloDoronichan', 'carlocarlo', 2, 1, 'Manila', 'Sta. Mesa', 'carlo@anime.com', 0, '09234545676', NULL, NULL),
(6, 'admin', 'admin', 'admin', 1, 1, 'Manila', 'Tondo', 'admin@admin.com', 0, '09236835707', NULL, NULL),
(7, 'Homer Cadena', 'ricknmorty', 'homerhomer', 2, 1, 'Quezon', 'Tandang Sora', 'homer@gmail.com', 0, '09235458097', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tblverification`
--

CREATE TABLE `tblverification` (
  `intVerifID` int(11) NOT NULL,
  `intVerifAccNo` int(9) NOT NULL,
  `strVerifValidID` varchar(45) NOT NULL,
  `datVerifReqDate` date NOT NULL,
  `intVerifResponse` int(1) NOT NULL,
  `intVerifAdSeen` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tblworker`
--

CREATE TABLE `tblworker` (
  `intWorkerID` int(11) NOT NULL,
  `intWorkBusID` int(11) NOT NULL,
  `strWorker` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblbusiness`
--
ALTER TABLE `tblbusiness`
  ADD PRIMARY KEY (`intBusinessID`),
  ADD KEY `intBusAccNo_idx` (`intBusAccNo`);

--
-- Indexes for table `tblchat`
--
ALTER TABLE `tblchat`
  ADD PRIMARY KEY (`intChatID`),
  ADD KEY `intUser1_idx` (`intChatSeeker`),
  ADD KEY `intChatServ_idx` (`intChatServ`);

--
-- Indexes for table `tbldocument`
--
ALTER TABLE `tbldocument`
  ADD PRIMARY KEY (`intDocID`),
  ADD KEY `intDocAccNo_idx` (`intDocAccNo`);

--
-- Indexes for table `tblmessage`
--
ALTER TABLE `tblmessage`
  ADD PRIMARY KEY (`intMessID`),
  ADD KEY `intMessChatID_idx` (`intMessChatID`);

--
-- Indexes for table `tblrating`
--
ALTER TABLE `tblrating`
  ADD PRIMARY KEY (`intRateID`),
  ADD KEY `intRatedAccNo_idx` (`intRatedAccNo`),
  ADD KEY `intRateTransID_idx` (`intRateTransID`);

--
-- Indexes for table `tblreport`
--
ALTER TABLE `tblreport`
  ADD PRIMARY KEY (`intRepID`),
  ADD KEY `intRepedAccNo_idx` (`intRepedAccNo`),
  ADD KEY `intRepTransID_idx` (`intRepTransID`);

--
-- Indexes for table `tblrequest`
--
ALTER TABLE `tblrequest`
  ADD PRIMARY KEY (`intReqID`),
  ADD KEY `intReqAccNo_idx` (`intReqAccNo`);

--
-- Indexes for table `tblservice`
--
ALTER TABLE `tblservice`
  ADD PRIMARY KEY (`intServID`),
  ADD KEY `intServAccNo_idx` (`intServAccNo`),
  ADD KEY `intServTag_idx` (`intServTag`);

--
-- Indexes for table `tblservicereq`
--
ALTER TABLE `tblservicereq`
  ADD PRIMARY KEY (`intServReqID`),
  ADD KEY `intSReqServID_idx` (`intSReqServID`),
  ADD KEY `intSReqAccNo_idx` (`intSReqAccNo`);

--
-- Indexes for table `tblservicetag`
--
ALTER TABLE `tblservicetag`
  ADD PRIMARY KEY (`intServTagID`);

--
-- Indexes for table `tbltransaction`
--
ALTER TABLE `tbltransaction`
  ADD PRIMARY KEY (`intTransID`),
  ADD KEY `intFinderAccNo_idx` (`intFinderAccNo`),
  ADD KEY `intTransServID_idx` (`intTransServID`);

--
-- Indexes for table `tbluser`
--
ALTER TABLE `tbluser`
  ADD PRIMARY KEY (`intAccNo`);

--
-- Indexes for table `tblverification`
--
ALTER TABLE `tblverification`
  ADD PRIMARY KEY (`intVerifID`),
  ADD KEY `intVerifAccNo_idx` (`intVerifAccNo`);

--
-- Indexes for table `tblworker`
--
ALTER TABLE `tblworker`
  ADD PRIMARY KEY (`intWorkerID`),
  ADD KEY `intWorkBusID_idx` (`intWorkBusID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblbusiness`
--
ALTER TABLE `tblbusiness`
  MODIFY `intBusinessID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tblchat`
--
ALTER TABLE `tblchat`
  MODIFY `intChatID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tbldocument`
--
ALTER TABLE `tbldocument`
  MODIFY `intDocID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tblmessage`
--
ALTER TABLE `tblmessage`
  MODIFY `intMessID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tblrating`
--
ALTER TABLE `tblrating`
  MODIFY `intRateID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tblreport`
--
ALTER TABLE `tblreport`
  MODIFY `intRepID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tblrequest`
--
ALTER TABLE `tblrequest`
  MODIFY `intReqID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tblservice`
--
ALTER TABLE `tblservice`
  MODIFY `intServID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `tblservicereq`
--
ALTER TABLE `tblservicereq`
  MODIFY `intServReqID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tblservicetag`
--
ALTER TABLE `tblservicetag`
  MODIFY `intServTagID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `tbltransaction`
--
ALTER TABLE `tbltransaction`
  MODIFY `intTransID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbluser`
--
ALTER TABLE `tbluser`
  MODIFY `intAccNo` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `tblverification`
--
ALTER TABLE `tblverification`
  MODIFY `intVerifID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tblworker`
--
ALTER TABLE `tblworker`
  MODIFY `intWorkerID` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblbusiness`
--
ALTER TABLE `tblbusiness`
  ADD CONSTRAINT `intBusAccNo` FOREIGN KEY (`intBusAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblchat`
--
ALTER TABLE `tblchat`
  ADD CONSTRAINT `intChatServ` FOREIGN KEY (`intChatServ`) REFERENCES `tblservice` (`intServID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `intUser1` FOREIGN KEY (`intChatSeeker`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tbldocument`
--
ALTER TABLE `tbldocument`
  ADD CONSTRAINT `intDocAccNo` FOREIGN KEY (`intDocAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblmessage`
--
ALTER TABLE `tblmessage`
  ADD CONSTRAINT `intMessChatID` FOREIGN KEY (`intMessChatID`) REFERENCES `tblchat` (`intChatID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblrating`
--
ALTER TABLE `tblrating`
  ADD CONSTRAINT `intRateTransID` FOREIGN KEY (`intRateTransID`) REFERENCES `tbltransaction` (`intTransID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `intRatedAccNo` FOREIGN KEY (`intRatedAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblreport`
--
ALTER TABLE `tblreport`
  ADD CONSTRAINT `intRepTransID` FOREIGN KEY (`intRepTransID`) REFERENCES `tbltransaction` (`intTransID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `intRepedAccNo` FOREIGN KEY (`intRepedAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblrequest`
--
ALTER TABLE `tblrequest`
  ADD CONSTRAINT `intReqAccNo` FOREIGN KEY (`intReqAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblservice`
--
ALTER TABLE `tblservice`
  ADD CONSTRAINT `intServAccNo` FOREIGN KEY (`intServAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `intServTag` FOREIGN KEY (`intServTag`) REFERENCES `tblservicetag` (`intServTagID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblservicereq`
--
ALTER TABLE `tblservicereq`
  ADD CONSTRAINT `intSReqAccNo` FOREIGN KEY (`intSReqAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `intSReqServID` FOREIGN KEY (`intSReqServID`) REFERENCES `tblservice` (`intServID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tbltransaction`
--
ALTER TABLE `tbltransaction`
  ADD CONSTRAINT `intFinderAccNo` FOREIGN KEY (`intFinderAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `intTransServID` FOREIGN KEY (`intTransServID`) REFERENCES `tblservice` (`intServID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblverification`
--
ALTER TABLE `tblverification`
  ADD CONSTRAINT `intVerifAccNo` FOREIGN KEY (`intVerifAccNo`) REFERENCES `tbluser` (`intAccNo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tblworker`
--
ALTER TABLE `tblworker`
  ADD CONSTRAINT `intWorkBusID` FOREIGN KEY (`intWorkBusID`) REFERENCES `tblbusiness` (`intBusinessID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
