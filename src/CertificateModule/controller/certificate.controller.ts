import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Constants, NeedRole, RoleGuard } from '../../CommonsModule';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiImplicitBody,
  ApiImplicitQuery,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { CertificateService } from '../service';
import { CertificateMapper } from '../mapper';
import { CertificateDTO, NewCertificateDTO } from '../dto';
import { RoleEnum } from '../../SecurityModule/enum';

@ApiUseTags('Certificate')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.CERTIFICATE_ENDPOINT}`,
)
export class CertificateController {
  constructor(
    private readonly mapper: CertificateMapper,
    private readonly service: CertificateService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    title: 'Get Certificates',
    description: 'Get all certificates',
  })
  @ApiOkResponse({
    type: CertificateDTO,
    isArray: true,
    description: 'All certificates',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN or STUDENT role',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async findAll(): Promise<CertificateDTO[]> {
    return this.mapper.toDtoList(await this.service.findAll());
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    type: CertificateDTO,
    description: 'Created certificate',
  })
  @ApiOperation({
    title: 'Add certificate',
    description: 'Creates a new certificate',
  })
  @ApiImplicitBody({ name: 'certificate', type: NewCertificateDTO })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async save(@Body() newCertificate: NewCertificateDTO) {
    return this.mapper.toDto(await this.service.save(newCertificate));
  }

  @Put('/:id')
  @HttpCode(200)
  @ApiImplicitQuery({
    name: 'id',
    type: Number,
    required: true,
    description: 'Certificate id',
  })
  @ApiOperation({
    title: 'Update certificate',
    description: 'Update certificate by id',
  })
  @ApiOkResponse({ type: NewCertificateDTO })
  @ApiNotFoundResponse({ description: 'thrown if certificate is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN or STUDENT role',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async update(
    @Param('id') id: string,
    @Body() certificate: CertificateDTO,
  ) {
    return this.mapper.toDto(await this.service.update(id, certificate));
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiImplicitQuery({
    name: 'id',
    type: Number,
    required: true,
    description: 'Certificate Id',
  })
  @ApiOperation({
    title: 'Find certificate by id',
    description: 'Find certificate by id',
  })
  @ApiNotFoundResponse({ description: 'thrown if certificate is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN or STUDENT role',
  })
  @NeedRole(RoleEnum.ADMIN, RoleEnum.STUDENT)
  @UseGuards(RoleGuard)
  public async findById(@Param('id') id: string): Promise<CertificateDTO> {
    return this.mapper.toDto(await this.service.findById(id));
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiImplicitQuery({
    name: 'id',
    type: Number,
    required: true,
    description: 'Certificate id',
  })
  @ApiOperation({
    title: 'Delete certificate',
    description: 'Delete certificate by id',
  })
  @ApiOkResponse({ type: null })
  @ApiNotFoundResponse({ description: 'thrown if certificate is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @NeedRole(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  public async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }
}
