import { CourseTaken } from '../entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class CourseTakenUpdateDTO {
    @ApiModelProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @Expose()
    user: CourseTaken['user'];

    @ApiModelProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @Expose()
    course: CourseTaken['course'];

    @ApiModelProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @Expose()
    courseStartDate: CourseTaken['courseStartDate'];

    @ApiModelProperty({ type: String })
    @IsString()
    @Expose()
    courseCompleteDate: CourseTaken['courseCompleteDate'];

    @ApiModelProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @Expose()
    status: CourseTaken['status'];

    @ApiModelProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @Expose()
    completition: CourseTaken['completition'];
}