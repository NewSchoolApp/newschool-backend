CREATE TABLE `role` (
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` int(11) NOT NULL,
  `id` varchar(36) NOT NULL,
  `name` ENUM('ADMIN', 'STUDENT', 'EXTERNAL') NOT NULL,
  CONSTRAINT `PK_ROLE` PRIMARY KEY (`id`),
  constraint IDX_ae4578dcaed5adff96595e6166 UNIQUE (name)
);
