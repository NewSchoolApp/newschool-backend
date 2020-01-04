CREATE TABLE `course` (
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` int(11) NOT NULL,
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `thumbUrl` varchar(255) DEFAULT NULL,
  `authorId` varchar(36) NOT NULL,
  CONSTRAINT PK_CRS PRIMARY KEY (`id`)
);