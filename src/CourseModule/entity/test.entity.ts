import { Audit } from '../../CommonsModule';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Part } from './part.entity';
import { Expose } from 'class-transformer';

@Unique(['nextTest', 'part'])
@Entity()
export class Test extends Audit{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        name: 'title'
    })
    title: string;

    @Column({
        nullable: false,
        name: 'correct_alternative'
    })
    correctAlternative: string;

    @Column({
        nullable: false,
        name: 'first_alternative'
    })
    firstAlternative: string;

    @Column({
        nullable: false,
        name: 'second_alternative'
    })
    secondAlternative: string;

    @Column({
        nullable: false,
        name: 'third_alternative'
    })
    thirdAlternative: string;

    @Column({
        nullable: false,
        name: 'fourth_alternative'
    })
    fourthAlternative: string;

    @Column({
        nullable: true,
        name: 'nxt_tst_id'
    })
    nextTest: string;

    @ManyToOne<Part>(() => Part, (part: Part) => part.tests)
    @JoinColumn({
        name: 'part_id'
    })
    part: Part;
}
