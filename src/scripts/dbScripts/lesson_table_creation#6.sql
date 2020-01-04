CREATE TABLE `lesson` (
    `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `id` varchar(36) NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` varchar(255) NOT NULL,
    `course_id` varchar(255) DEFAULT NULL,
    `nxt_lsn_id` varchar(255) DEFAULT NULL,
    CONSTRAINT PK_LSN PRIMARY KEY (`id`),
    CONSTRAINT FK_LSN_CRS FOREIGN KEY (`course_id`) REFERENCES course (`id`),
    CONSTRAINT CHK_NXT_LSN_ID CHECK ((`nxt_lsn_id` IN (SELECT id FROM lesson)) OR (nxt_lsn_id IS NULL)),
    CONSTRAINT UNQ_NXT_LSN_ID UNIQUE (`nxt_lsn_id`, `course_id`)
);