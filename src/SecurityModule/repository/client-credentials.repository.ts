import { EntityRepository, Repository, EntityManager } from 'typeorm';
import { ClientCredentials } from '../entity';
import { ClientCredentialsEnum } from '../enum';

@EntityRepository(ClientCredentials)
export class ClientCredentialsRepository extends Repository<ClientCredentials> {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

  async findByNameAndSecret(name: ClientCredentialsEnum, secret: string) {
    return this.entityManager
      .getRepository(ClientCredentials)
      .findOne({ name, secret }, { relations: ['role'] });
  }

}
