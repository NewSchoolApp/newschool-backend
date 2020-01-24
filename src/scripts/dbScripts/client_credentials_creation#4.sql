create TABLE `client-credentials` (
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` int(11) NOT NULL,
  `id` varchar(36) NOT NULL,
  `name` ENUM('NEWSCHOOL@EXTERNAL', 'NEWSCHOOL@FRONT') NOT NULL,
  `secret` varchar(255) NOT NULL,
  `roleId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CLNT_CRDTLS` (`roleId`),
  CONSTRAINT `FK_CLNT_CRDTLS` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON delete NO ACTION ON update NO ACTION,
  CONSTRAINT IDX_c6528d2d9ab22e6802915fd9f9 UNIQUE (name)
);
