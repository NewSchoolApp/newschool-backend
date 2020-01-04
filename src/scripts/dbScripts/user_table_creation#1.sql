CREATE TABLE `user` (
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` int(11) NOT NULL,
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `url_facebook` varchar(255) NOT NULL,
  `url_instagram` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL DEFAULT '',
  `roleId` varchar(36) DEFAULT NULL,
  CONSTRAINT PK_USER PRIMARY KEY (`id`),
  KEY `FK_USR_ROLE` (`roleId`),
  CONSTRAINT `FK_USR_ROLE` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
);