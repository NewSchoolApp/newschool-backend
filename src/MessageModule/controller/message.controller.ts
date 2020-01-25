import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from '../service';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import { ContactUsDTO, EmailDTO } from '../dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EmailSwagger } from '../swagger';
import { RoleEnum } from '../../SecurityModule/enum';
import { TemplateDTO } from '../dto/templates.dto';
import { SendMessageSwagger } from '../swagger/sendmessage.swagger';

@ApiTags('Message')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.MESSAGE_ENDPOINT}`,
)
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(private readonly service: MessageService) {}

  @Post('/email')
  @HttpCode(201)
  @ApiCreatedResponse({ type: EmailDTO, description: 'Send email' })
  @ApiOperation({
    summary: 'Send email message',
    description: 'Send a new email message',
  })
  @ApiBody({ type: EmailSwagger })
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
    summary: 'Send contact us message',
    description: 'Send a new contact us email message',
  })
  @ApiBody({ type: ContactUsDTO })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN/External role',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @UseGuards(RoleGuard)
  public async sendEmailContactUs(
    @Body() contactUs: ContactUsDTO,
  ): Promise<void> {
    this.logger.log(`ContactUs: ${JSON.stringify(contactUs)}`);
    await this.service.sendContactUsEmail(contactUs);
  }

  @Get('listTemplates')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all templates',
    description: 'Get all templates',
  })
  @ApiOkResponse({
    type: TemplateDTO,
    isArray: true,
    description: 'All Templates',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @ApiForbiddenResponse({
    description: 'You dont have permission',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async listAllTemplates(): Promise<TemplateDTO[]> {
    return this.service.getAllTemplates();
  }

  @Put('editTemplate')
  @HttpCode(200)
  @ApiBody({ type: TemplateDTO })
  @ApiOperation({
    summary: 'Edit one template',
    description: 'Edit one template by name',
  })
  @ApiNotFoundResponse({ description: 'thrown if template is not found' })
  @ApiOkResponse({
    type: TemplateDTO,
    description: 'Template successfully edited',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @ApiForbiddenResponse({
    description: 'You dont have permission',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async editTemplate(
    @Body() updatedTemplate: TemplateDTO,
  ): Promise<TemplateDTO> {
    return await this.service.editTemplate(updatedTemplate);
  }

  @Post('createTemplate')
  @HttpCode(200)
  @ApiBody({
    type: TemplateDTO,
    description:
      'Rules for template creation: <br />' +
      'Create as an html template. <br />' +
      'Place fields that will be replaced must be placed with sequential numbers. <br />',
  })
  @ApiOperation({ summary: 'Create template', description: 'Create template' })
  @ApiCreatedResponse({
    type: TemplateDTO,
    description: 'Template successfully created',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @ApiConflictResponse({
    description:
      'Templates cannot have duplicate names, please rename and try again.',
  })
  @ApiForbiddenResponse({
    description: 'You dont have permission',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async createTemplate(
    @Body() template: TemplateDTO,
  ): Promise<TemplateDTO> {
    return await this.service.createTemplate(template);
  }

  @Post('sendMessage')
  @HttpCode(200)
  @ApiBody({
    type: SendMessageSwagger,
    description:
      'The template has the free body property, that is you can enter the ' +
      'values you need for sending the message.',
    required: true,
  })
  @ApiOperation({ summary: 'Send Message', description: 'Send a message' })
  @ApiOkResponse({ description: 'Message successfully sended' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @ApiNotFoundResponse({
    description: 'Template not found',
  })
  @ApiForbiddenResponse({
    description: 'You dont have permission',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async sendMessage(@Body() model: any): Promise<void> {
    await this.service.sendMessage(
      model.data,
      model.templateName,
      model.contactEmail,
    );
  }
}
