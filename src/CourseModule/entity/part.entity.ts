import { Audit } from "src/CommonsModule";
<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, Unique } from "typeorm";
=======
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from "typeorm";
>>>>>>> Subindo alterações do CRUD Cursos/aulas/partes
import { Course, Lesson } from '.';
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

    @ManyToOne(() => Lesson, (lesson: Lesson) => lesson.id)
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
