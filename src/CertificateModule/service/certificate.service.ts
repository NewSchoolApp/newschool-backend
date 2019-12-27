import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CertificateRepository } from '../repository';
import { Certificate } from '../entity';
import { CertificateDTO, NewCertificateDTO } from '../dto';

@Injectable()
export class CertificateService {

  constructor(
    private readonly entityManager: EntityManager,
  ) {
  }

  public async findAll(): Promise<Certificate[]> {
    return this.entityManager.getCustomRepository(CertificateRepository).find();
  }

  async save(certificate: NewCertificateDTO): Promise<Certificate> {
    return await this.entityManager.getCustomRepository(CertificateRepository).save(certificate);
  }

  public async findById(id: Certificate['id']): Promise<Certificate> {
    const foundCertificate: Certificate | undefined = await this.entityManager.getCustomRepository(CertificateRepository).findById(id);
    if (!foundCertificate) {
      throw new NotFoundException('Certificate not found');
    }
    return foundCertificate;
  }

  public async update(id: Certificate['id'], certificate: CertificateDTO): Promise<Certificate> {
    const foundCertificate: Certificate = await this.findById(id);
    return this.save({ ...foundCertificate, ...certificate });
  }

  public async delete(id: Certificate['id']) {
    await this.findById(id);
    await this.entityManager.getCustomRepository(CertificateRepository).delete({ id });
  }
}
