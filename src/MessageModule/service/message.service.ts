import {
  BadRequestException,
  ConflictException, forwardRef,
  GoneException, Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nest-modules/mailer';
import { ContactUsDTO, EmailDTO, SMSDTO } from '../dto';

@Injectable()
export class MessageService {

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
  }
    
  public async sendEmail(email: EmailDTO):Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: 'Newschoolcontato@gmail.com',
        from: email.email,
        subject: email.title,
        html: email.message        
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }  

  public async sendContactUsEmail(contactUs: ContactUsDTO):Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: 'newschoolcontato@gmail.com',
        from: contactUs.email,
        subject: 'Fale conosco',
        template: 'contact-us',
        context: {
          name: contactUs.name,          
          message: contactUs.message
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }  
}
