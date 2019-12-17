import { deserializeArray, plainToClass, serialize } from 'class-transformer';

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
    return deserializeArray<D>(this.dtoClass, serialize<E>(entityArray));
  }

  toEntity(dtoObject: D): E {
    return plainToClass<E, D>(this.entityClass, dtoObject, { excludeExtraneousValues: true });
  }

  toEntityList(dtoArray: D): E[] {
    return deserializeArray<E>(this.entityClass, serialize<D>(dtoArray));
  }

}
