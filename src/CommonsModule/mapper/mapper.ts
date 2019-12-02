import { deserializeArray, plainToClass, serialize } from 'class-transformer';

export class Mapper<E, D> {

  constructor(
    private entityClaz: new () => E,
    private dtoClaz: new () => D,
  ) {
  }

  toDto(entityObject: E): D {
    return plainToClass<D, E>(this.dtoClaz, entityObject);
  }

  toDtoList(entityArray: E[]): D[] {
    return deserializeArray<D>(this.dtoClaz, serialize<E>(entityArray));
  }

  toEntity(dtoObject: D): E {
    return plainToClass<E, D>(this.entityClaz, dtoObject);
  }

  toEntityList(dtoArray: D): E[] {
    return deserializeArray<E>(this.entityClaz, serialize<D>(dtoArray));
  }

}
