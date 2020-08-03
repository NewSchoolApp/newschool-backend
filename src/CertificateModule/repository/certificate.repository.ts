import { EntityRepository, Repository } from 'typeorm';
import { Certificate } from '../entity/certificate.entity';

@EntityRepository(Certificate)
export class CertificateRepository extends Repository<Certificate> {
  public async findById(id: string): Promise<Certificate | undefined> {
    return this.findOne({ id });
  }
}
