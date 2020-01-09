import { EntityRepository, Repository } from 'typeorm';
import { Templates } from '../entity/templates.entity';

@EntityRepository(Templates)
export class TemplateRepository extends Repository<Templates> {
    public async findById(id: string): Promise<Templates> {
        return this.findOne({ id });
    }

    public async findByName(name: string): Promise<Templates> {
        return this.findOne({ where: { name } });
    }
}
