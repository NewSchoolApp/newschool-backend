import slugify from 'slugify';
import { Expose } from 'class-transformer';

export class PolicyDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  get slug(): string {
    return slugify(this.name);
  }

  set slug(name: string) {}
}
