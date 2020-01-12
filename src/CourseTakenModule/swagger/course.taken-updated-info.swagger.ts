import { ApiModelProperty } from '@nestjs/swagger';
import { CourseTaken } from '../entity';

export class CourseTakenUpdatedInfoSwagger {
    
    @ApiModelProperty({ type: String })
    user: CourseTaken['user'];

    @ApiModelProperty({ type: String })
    course: CourseTaken['course'];

    @ApiModelProperty({ type: String })
    courseStartDate: CourseTaken['courseStartDate'];

    @ApiModelProperty({ type: String })
    courseCompleteDate: CourseTaken['courseCompleteDate'];

    @ApiModelProperty({ type: String })
    status: CourseTaken['status'];

    @ApiModelProperty({ type: String })
    completition: CourseTaken['completition'];

}