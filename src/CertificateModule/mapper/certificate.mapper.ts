import { Injectable } from '@nestjs/common';
import { Mapper } from '../../CommonsModule/mapper';
import { Certificate } from '../entity';
import { CertificateDTO } from '../dto';

@Injectable()
export class CertificateMapper extends Mapper<Certificate, CertificateDTO> {
  constructor() {
    super(Certificate, CertificateDTO);
  }

  toDto(entityObject: Certificate): CertificateDTO {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Certificate[]): CertificateDTO[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: CertificateDTO): Certificate {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: CertificateDTO[]): Certificate[] {
    return super.toEntityList(dtoArray);
  }
}
