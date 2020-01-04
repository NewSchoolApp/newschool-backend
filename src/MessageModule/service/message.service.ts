import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nest-modules/mailer';
import { ContactUsDTO, EmailDTO } from '../dto';
import { EmailRepository } from '../repository/email.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { EmailMapper } from '../mapper/email.mapper';
import { EmailMessageDTO } from '../dto/email.message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly emailRepository: EmailRepository,
    private readonly mapperEmail: EmailMapper,
  ) { }

  public async sendEmail(email: EmailDTO): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: this.configService.get<string>('EMAIL_CONTACTUS'),
        from: email.email,
        subject: email.title,
        html: email.message,
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async sendContactUsEmail(contactUs: ContactUsDTO): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: this.configService.get<string>('EMAIL_CONTACTUS'),
        from: contactUs.email,
        subject: 'Fale conosco',
        template: 'contact-us',
        context: {
          name: contactUs.name,
          message: contactUs.message,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async getAllEmails(): Promise<EmailMessageDTO[]> {
    try {
      return await this.emailRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Transactional()
  public async editEmail(emailId: string, updatedEmail: EmailMessageDTO): Promise<EmailMessageDTO> {
    try {
      const email: EmailMessageDTO = await this.emailRepository.findOne(emailId);
      if (!email) {
        throw new NotFoundException('Email not found');
      }

      return await this.emailRepository.save({ ...email, ...updatedEmail });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
