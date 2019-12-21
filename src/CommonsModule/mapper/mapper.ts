import { plainToClass } from 'class-transformer';

export class Mapper<E, D> {

  constructor(
    private entityClass: new () => E,
    private dtoClass: new () => D,
  ) {
  }

  toDto(entityObject: E): D {
    return plainToClass<D, E>(this.dtoClass, entityObject, { excludeExtraneousValues: true });
  }

  toDtoList(entityArray: E[]): D[] {
    return plainToClass<D, E>(this.dtoClass, entityArray, { excludeExtraneousValues: true });
  }

  toEntity(dtoObject: D): E {
    return plainToClass<E, D>(this.entityClass, dtoObject, { excludeExtraneousValues: true });
  }

  toEntityList(dtoArray: D[]): E[] {
    return plainToClass<E, D>(this.entityClass, dtoArray, { excludeExtraneousValues: true });
  }

}
