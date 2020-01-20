import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CertificateRepository } from '../repository';
import { Certificate } from '../entity';
import { CertificateDTO, NewCertificateDTO } from '../dto';

@Injectable()
export class CertificateService {
  constructor(private readonly repository: CertificateRepository) {}

  @Transactional()
  public async findAll(): Promise<Certificate[]> {
    return this.repository.find();
  }

  @Transactional()
  async save(certificate: NewCertificateDTO): Promise<Certificate> {
    return await this.repository.save(certificate);
  }

  @Transactional()
  public async findById(id: Certificate['id']): Promise<Certificate> {
    const foundCertificate:
      | Certificate
      | undefined = await this.repository.findById(id);
    if (!foundCertificate) {
      throw new NotFoundException('Certificate not found');
    }
    return foundCertificate;
  }

  @Transactional()
  public async update(
    id: Certificate['id'],
    certificate: CertificateDTO,
  ): Promise<Certificate> {
    const foundCertificate: Certificate = await this.findById(id);
    return this.save({ ...foundCertificate, ...certificate });
  }

  @Transactional()
  public async delete(id: Certificate['id']) {
    await this.findById(id);
    await this.repository.delete({ id });
  }
}
