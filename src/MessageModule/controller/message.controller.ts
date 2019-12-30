import {
  Body,
  Controller,  
  HttpCode,  
  Logger,  
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { EmailDTO, SMSDTO, ContactUsDTO } from '../dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,  
  ApiImplicitBody,  
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { EmailSwagger } from '../swagger';
import { ContactUsSwagger } from '../swagger';
import { RoleEnum } from '../../SecurityModule/enum';

@ApiUseTags('Message')
@ApiBearerAuth()
@Controller(`${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.MESSAGE_ENDPOINT}`)
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(
    private readonly service: MessageService    
  ) {
  }


  @Post("/email")
  @HttpCode(201)
  @ApiCreatedResponse({ type: EmailDTO, description: 'Send email' })
  @ApiOperation({ title: 'Send email message', description: 'Send a new email message' })
  @ApiImplicitBody({ name: 'Email', type: EmailSwagger })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have ADMIN/External role' })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async sendemail(@Body() email: EmailDTO): Promise<void> {
    this.logger.log(`email: ${email}`);
    await this.service.sendEmail(email);
  }  

  @Post("/email/contactus")
  @HttpCode(201)
  @ApiCreatedResponse({ type: ContactUsDTO, description: 'Send contact us email' })
  @ApiOperation({ title: 'Send contact us message', description: 'Send a new contact us email message' })
  @ApiImplicitBody({ name: 'ContactUs', type: ContactUsSwagger })
  @ApiUnauthorizedResponse({ description: 'thrown if there is not an authorization token or if authorization token does not have ADMIN/External role' })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async sendEmailContactUs(@Body() contactUs: ContactUsDTO): Promise<void> {
    this.logger.log(`ContactUs: ${contactUs}`);
    await this.service.sendContactUsEmail(contactUs);
  }  
}
