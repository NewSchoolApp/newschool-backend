import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EventNameEnum } from '../enum/event-name.enum';

export class BadgeUpdateDTO {
  @IsNotEmpty()
  @IsEnum(EventNameEnum)
  eventName: EventNameEnum;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  points: number;

  @IsNotEmpty()
  @IsNumber()
  eventOrder: number;
}
