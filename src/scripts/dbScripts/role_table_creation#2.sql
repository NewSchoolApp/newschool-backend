CREATE TABLE `role` (
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` int(11) NOT NULL,
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  CONSTRAINT `PK_ROLE` PRIMARY KEY (`id`)
);