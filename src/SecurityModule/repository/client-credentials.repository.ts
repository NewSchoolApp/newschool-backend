import { EntityRepository, Repository } from 'typeorm';
import { ClientCredentials } from '../entity/client-credentials.entity';

@EntityRepository(ClientCredentials)
export class ClientCredentialsRepository extends Repository<ClientCredentials> {
  async findByNameAndSecret(
    name: string,
    secret: string,
  ): Promise<ClientCredentials> {
    return this.findOne(
      { name, secret },
      { relations: ['role', 'role.policies'] },
    );
  }
}
