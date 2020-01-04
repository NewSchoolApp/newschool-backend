CREATE TABLE `client-credentials` (
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `version` int(11) NOT NULL,
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `secret` varchar(255) NOT NULL,
  `roleId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CLNT_CRDTLS` (`roleId`),
  CONSTRAINT `FK_CLNT_CRDTLS` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);