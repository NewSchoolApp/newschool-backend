import {  
  Injectable,
  InternalServerErrorException  
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
        to: this.configService.get<string>('EMAIL_CONTACTUS'),
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
        to: this.configService.get<string>('EMAIL_CONTACTUS'),
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
