import { EntityRepository, Repository } from 'typeorm';
import { EmailMessage } from '../entity/email.message.entity';

@EntityRepository(EmailMessage)
export class EmailRepository extends Repository<EmailMessage> { }
