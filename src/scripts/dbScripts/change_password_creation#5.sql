CREATE TABLE `change_password` (
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` int(11) NOT NULL,
  `id` varchar(36) NOT NULL,
  `expirationTime` int(11) NOT NULL,
  `userId` varchar(36) DEFAULT NULL,
  CONSTRAINT `PK_CHG_PWD` PRIMARY KEY (`id`),
  KEY `FK_CHG_PWD_USR` (`userId`),
  CONSTRAINT `FK_CHG_PWD_USR` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);