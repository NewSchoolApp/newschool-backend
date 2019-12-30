import { EntityRepository, Repository } from 'typeorm';
import { Part } from '../entity';

@EntityRepository(Part)
export class PartRepository extends Repository<Part> {

    async findByTitle({ title }): Promise<Part | undefined> {
        return this.findOne({ title });
    }

    async findById({ id }): Promise<Part | undefined> {
        return this.findOne({ id });
    }

    async findByTitleAndLessonId({ title, lessonId }): Promise<Part | undefined> {
        return this.findOne({ title, lessonId });
    }
}
