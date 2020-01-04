import { Audit } from "src/CommonsModule";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique, OneToMany } from "typeorm";
import { Course } from '.';
import { Part } from "./part.entity";

@Unique(['nextLesson', 'course'])
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

    @Column({
        nullable: true,
        name: 'nxt_lsn_id'
    })
    nextLesson: string;

    @ManyToOne<Course>(() => Course, (course: Course) => course.lessons)
    @JoinColumn({
        name: 'course_id'
    })
    course: Course;

    @OneToMany<Part>(() => Part, (part: Part) => part.lesson)
    parts: Part[];
}
