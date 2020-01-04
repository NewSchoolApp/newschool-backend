import { Audit } from "src/CommonsModule";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Lesson } from '.';
import { tsNamespaceExportDeclaration } from "@babel/types";

@Unique(['nextPart', 'lesson'])
@Entity()
export class Part extends Audit{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        name: 'title'
    })
    title: string;

    @Column({
        nullable: false,
        name: 'description'
    })
    description: string;

    @Column({
        nullable: true,
        name: 'vimeo_url'
    })
    vimeoUrl: string;

    @Column({
        nullable: true,
        name: 'youtube_url'
    })
    youtubeUrl: string;

    @ManyToOne<Lesson>(() => Lesson, (lesson: Lesson) => lesson.parts)
    @JoinColumn({
        name: 'lesson_id'
    })
    lesson: Lesson;

    @Column({
        nullable: true,
        name: 'nxt_prt_id'
    })
    nextPart: string;
}
