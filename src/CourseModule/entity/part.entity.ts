import { Audit } from "src/CommonsModule";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from "typeorm";
import { Course, Lesson } from '.';


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

    @OneToOne(type=>Lesson)
    @Column({
        nullable: true,
        name: 'lesson_id'
    })
    lessonId: Lesson;

    @OneToOne(type=>Part)
    @Column({
        nullable: true,
        name: 'nxt_prt_id'
    })
    nextPartId: Part;
}
