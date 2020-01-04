import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { EmailMessage } from '../entity/email.message.entity';
import { EmailMessageDTO } from '../dto/email.message.dto';

@Injectable()
export class EmailMapper extends Mapper<EmailMessage, EmailMessageDTO> {
  constructor() {
    super(EmailMessage, EmailMessageDTO);
  }

  toDto(entityObject: EmailMessage): EmailMessageDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: EmailMessage[]): EmailMessageDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: EmailMessageDTO): EmailMessage {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: EmailMessageDTO[]): EmailMessage[] {
    return super.toEntityList(dtoArray);
  }
}
