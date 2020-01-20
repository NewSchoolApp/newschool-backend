import { EntityRepository, Repository } from 'typeorm';
import { ClientCredentials } from '../entity';
import { ClientCredentialsEnum } from '../enum';

@EntityRepository(ClientCredentials)
export class ClientCredentialsRepository extends Repository<ClientCredentials> {
  async findByNameAndSecret(name: ClientCredentialsEnum, secret: string) {
    return this.findOne({ name, secret }, { relations: ['role'] });
  }
}
