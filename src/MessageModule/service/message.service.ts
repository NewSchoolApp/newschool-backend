import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nest-modules/mailer';
import { ContactUsDTO, EmailDTO } from '../dto';
import { TemplateRepository } from '../repository/template.repository';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { TemplateDTO } from '../dto/templates.dto';
import { TemplateMapper } from '../mapper/template.mapper';

@Injectable()
export class MessageService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly templateRepository: TemplateRepository,
    private readonly mapperTemplate: TemplateMapper,
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

  public async sendMessage(messageModel: any, templateName: string, contactEmail: string): Promise<void> {
    try {
      const model = await this.templateExists(templateName);
      const message = this.transformObjectToArray(messageModel);
      const htmlMessage = this.substituteInterpolationPerValues(model.template, message);

      await this.mailerService.sendMail({
        to: this.configService.get<string>('EMAIL_CONTACTUS'),
        from: contactEmail,
        subject: model.title,
        html: htmlMessage,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async getAllTemplates(): Promise<TemplateDTO[]> {
    try {
      return this.mapperTemplate.toDtoList(await this.templateRepository.find());
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Transactional()
  public async editTemplate(updatedTemplate: TemplateDTO): Promise<TemplateDTO> {
    try {
      const template: TemplateDTO = await this.templateExists(updatedTemplate.name);

      return await this.templateRepository.save({ ...template, ...updatedTemplate });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Transactional()
  public async createTemplate(template: TemplateDTO): Promise<TemplateDTO> {
    try {
      if (await this.templateRepository.findByName(template.name)) {
        throw new NotAcceptableException('Templates cannot have duplicate names, please rename and try again.');
      }
      return this.mapperTemplate.toDto(await this.templateRepository.save(template));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async templateExists(templateName: string): Promise<TemplateDTO> {
    const template = await this.templateRepository.findByName(templateName);
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  private substituteInterpolationPerValues(html: string, values: any[]): string {
    return html.replace(/({\d})/g, (i) => {
      return values[i.replace(/{/, '').replace(/}/, '')];
    });
  }

  private transformObjectToArray(model: any): any[] {
    return Object.keys(model).map((key) => model[key]);
  }
}
