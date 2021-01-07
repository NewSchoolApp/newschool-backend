import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { School } from '../dto/school.dto';
import { School as SchoolEntity } from '../entity/school.entity';

@Injectable()
export class SchoolService {
  constructor(
    private http: HttpService,
    @InjectRepository(SchoolEntity)
    private readonly repository: Repository<SchoolEntity>,
  ) {}

  public async getUserSchool(name: string): Promise<School[]> {
    return await this.repository.find({ where: { school: Like(`%${name}`) } });
  }
}
