import { Audit } from "src/CommonsModule";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Course } from '.';

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

    @ManyToOne(() => Course, (course: Course) => course.id)
    @JoinColumn({
        name: 'course_id'
    })
    course: Course;

    @Column({
        nullable: true,
        name: 'nxt_lsn_id'
    })
    nextLesson: string;
}
