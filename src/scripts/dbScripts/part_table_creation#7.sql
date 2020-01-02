CREATE TABLE `part` (
    `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `id` varchar(36) NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` varchar(255) NOT NULL,
    `vimeo_url` varchar(255) DEFAULT NULL,
    `youtube_url` varchar(255) DEFAULT NULL,
    `lesson_id` varchar(36) NOT NULL,
    `nxt_prt_id` varchar(36) NOT NULL,
    CONSTRAINT PK_PRT PRIMARY KEY (`id`),
    CONSTRAINT FK_PRT_LSN FOREIGN KEY (`lesson_id`) REFERENCES lesson (`id`),
    CONSTRAINT CHK_NXT_PRT_ID CHECK ((nxt_prt_id IN (SELECT id FROM part)) OR (nxt_prt_id IS NULL)),
    CONSTRAINT UNQ_NXT_PRT_ID UNIQUE (`nxt_prt_id`, `lesson_id`)
);