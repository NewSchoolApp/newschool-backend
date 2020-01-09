import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

@Entity()
export class Templates {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Unique(['name'])
  name: string;

  @Column()
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column()
  @Expose()
  @IsNotEmpty()
  @IsString()
  template: string;

}
