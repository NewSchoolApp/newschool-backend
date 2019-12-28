import { Injectable, NotFoundException } from '@nestjs/common';
import { CertificateRepository } from '../repository';
import { Certificate } from '../entity';
import { CertificateDTO, NewCertificateDTO } from '../dto';

@Injectable()
export class CertificateService {

  constructor(
    private readonly repository: CertificateRepository,
  ) {
  }

  public async findAll(): Promise<Certificate[]> {
    return this.repository.find();
  }

  async save(certificate: NewCertificateDTO): Promise<Certificate> {
    return await this.repository.save(certificate);
  }

  public async findById(id: Certificate['id']): Promise<Certificate> {
    const foundCertificate: Certificate | undefined = await this.repository.findById(id);
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
    await this.repository.delete({ id });
  }
}
