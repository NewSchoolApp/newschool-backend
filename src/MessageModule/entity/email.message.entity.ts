import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

@Entity()
export class EmailMessage {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  @IsOptional()
  id: string;

  @Column()
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column()
  @Expose()
  @IsNotEmpty()
  @IsString()
  message: string;
}
