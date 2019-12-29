import { Audit } from "src/CommonsModule";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from "typeorm";
import { Course } from '.';


@Entity()
export class Lesson extends Audit{
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

    @ManyToOne(type=>Course)
    @Column({
        nullable: false,
        name: 'course_id'
    })
    courseId: Course;

    @OneToOne(type=>Lesson)
    @Column({
        nullable: true,
        name: 'nxt_lsn_id'
    })
    next_lesson_id: Lesson;
}