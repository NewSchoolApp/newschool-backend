import { EntityRepository, Repository } from 'typeorm';
import { Lesson } from '../entity';

@EntityRepository(Lesson)
export class LessonRepository extends Repository<Lesson>{

    async findByTitle({ title, courseId }): Promise<Lesson | undefined>{
        return this.findByTitleAndCourseId({ title, courseId });
    }

    async findById({ id }): Promise<Lesson | undefined>{
        return this.findOne({ id });
    }

    async findByTitleAndCourseId({ title, courseId }): Promise<Lesson | undefined> {
        return this.findOne({ title, courseId });
    }
}
