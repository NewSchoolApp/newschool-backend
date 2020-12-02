import { EntityRepository, Repository } from 'typeorm';
import { ClientCredentials } from '../entity/client-credentials.entity';
import { ClientCredentialsEnum } from '../enum/client-credentials.enum';

@EntityRepository(ClientCredentials)
export class ClientCredentialsRepository extends Repository<ClientCredentials> {
  async findByNameAndSecret(
    name: ClientCredentialsEnum,
    secret: string,
  ): Promise<ClientCredentials> {
    return this.findOne({ name, secret }, { relations: ['role'] });
  }
}
