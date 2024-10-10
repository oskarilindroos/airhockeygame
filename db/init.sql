CREATE TABLE IF NOT EXISTS `status`(
    `statusID` INT NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`statusID`)

)ENGINE=InnoDB;

INSERT INTO `status` (statusID, status)
VALUES
(0, 'Waiting for players'),
(1, 'Game in progress'),
(2, 'Game over')
;

CREATE TABLE IF NOT EXISTS `roomTable`(
    `roomID` INT NOT NULL AUTO_INCREMENT,
    `statusID` INT NOT NULL DEFAULT 0,
    `url`  VARCHAR(255) NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`roomID`),
    FOREIGN KEY (`statusID`) REFERENCES `status` (`statusID`)

)ENGINE=InnoDB;