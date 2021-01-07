import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string;

  @Column({ nullable: false })
  @Expose()
  school: string;

  @Column()
  @Expose()
  uf: string;
}
