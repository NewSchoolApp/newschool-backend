import { Audit } from "src/CommonsModule";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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
    vimeo_url: string;

    @Column({
        nullable: true,
        name: 'youtube_url'
    })
    youtube_url: string;
}