import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseGuards,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { MessageService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { EmailDTO, ContactUsDTO } from '../dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiImplicitBody,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { EmailSwagger } from '../swagger';
import { ContactUsSwagger } from '../swagger';
import { RoleEnum } from '../../SecurityModule/enum';
import { EmailMessage } from '../entity/email.message.entity';
import { EmailMessageDTO } from '../dto/email.message.dto';

@ApiUseTags('Message')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.MESSAGE_ENDPOINT}`,
)
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(private readonly service: MessageService) { }

  @Post('/email')
  @HttpCode(201)
  @ApiCreatedResponse({ type: EmailDTO, description: 'Send email' })
  @ApiOperation({
    title: 'Send email message',
    description: 'Send a new email message',
  })
  @ApiImplicitBody({ name: 'Email', type: EmailSwagger })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN/External role',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async sendemail(@Body() email: EmailDTO): Promise<void> {
    this.logger.log(`email: ${email}`);
    await this.service.sendEmail(email);
  }

  @Post('/email/contactus')
  @HttpCode(201)
  @ApiCreatedResponse({
    type: ContactUsDTO,
    description: 'Send contact us email',
  })
  @ApiOperation({
    title: 'Send contact us message',
    description: 'Send a new contact us email message',
  })
  @ApiImplicitBody({ name: 'ContactUs', type: ContactUsSwagger })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN/External role',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async sendEmailContactUs(
    @Body() contactUs: ContactUsDTO,
  ): Promise<void> {
    this.logger.log(`ContactUs: ${contactUs}`);
    await this.service.sendContactUsEmail(contactUs);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ title: 'Get Emails', description: 'Get all Emails' })
  @ApiOkResponse({
    type: EmailMessageDTO,
    isArray: true,
    description: 'All emails',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async listAllEmails(): Promise<EmailMessage[]> {
    return this.service.getAllEmails();
  }

  @Put(':id')
  @HttpCode(200)
  @ApiImplicitBody({ name: 'Email', type: EmailMessageDTO })
  @ApiOperation({ title: 'Edit Email', description: 'Edit one email by id' })
  @ApiNotFoundResponse({ description: 'thrown if email is not found' })
  @ApiOkResponse({ type: EmailMessageDTO, description: 'Edit email successful' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async editEmail(
    @Param('id') emailId: string,
    @Body() updatedEmail: EmailMessageDTO,
  ): Promise<EmailMessageDTO> {
    return await this.service.editEmail(emailId, updatedEmail);
  }
}
