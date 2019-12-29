import { EntityRepository, Repository } from 'typeorm';
import { Lesson } from '../entity';

@EntityRepository(Lesson)
export class LessonRepository extends Repository<Lesson>{

    async findByTitle(title:string): Promise<Lesson | undefined>{
        return this.findOne({title});
    }

}