CREATE TABLE `course` (
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` int(11) NOT NULL,
  `id` varchar(36) NOT NULL,
  `title` varchar(255) UNIQUE NOT NULL,
  `description` varchar(255) NOT NULL,
  `thumbUrl` varchar(255) DEFAULT NULL,
  `userId` varchar(36) NOT NULL,
  CONSTRAINT PK_CRS PRIMARY KEY (`id`)
  CONSTRAINT `FK_USER_ID` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
);
