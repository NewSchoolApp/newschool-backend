import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CertificateRepository } from '../repository';
import { Certificate } from '../entity';
import { CertificateDTO, NewCertificateDTO } from '../dto';
import { createQueryBuilder } from 'typeorm';

@Injectable()
export class CertificateService {

  constructor(
    private readonly repository: CertificateRepository,
  ) {
  }

  @Transactional()
  public async findAll(): Promise<Certificate[]> {
    return this.repository.find();
  }

  @Transactional()
  public async getCertificateByUser(userId): Promise<CertificateDTO[]> {
    const certificates = await createQueryBuilder("user", "user")
    .innerJoinAndSelect("certificate_users_user", "certificate_user", "certificate_user.userId = user.id")
    .innerJoinAndSelect("certificate", "certificate", "certificate.id = certificate_user.certificateId")
    .where("user.id = :userId", {userId})
    .getRawMany()

    const userCertificates = certificates.map<CertificateDTO>(certificate=> {
      const c = new CertificateDTO()
      c.id = certificate.certificate_id;
      c.title = certificate.certificate_title;
      c.userName = certificate.user_name;
      c.text = certificate.certificate_text;
      c.styleName = certificate.certificate_styleName;

      return c;
    })
    return userCertificates
  }

  @Transactional()
  async save(certificate: NewCertificateDTO): Promise<Certificate> {
    return await this.repository.save(certificate);
  }

  @Transactional()
  public async findById(id: Certificate['id']): Promise<Certificate> {
    const foundCertificate: Certificate | undefined = await this.repository.findById(id);
    if (!foundCertificate) {
      throw new NotFoundException('Certificate not found');
    }
    return foundCertificate;
  }

  @Transactional()
  public async update(id: Certificate['id'], certificate: CertificateDTO): Promise<Certificate> {
    const foundCertificate: Certificate = await this.findById(id);
    return this.save({ ...foundCertificate, ...certificate });
  }

  @Transactional()
  public async delete(id: Certificate['id']) {
    await this.findById(id);
    await this.repository.delete({ id });
  }
}
