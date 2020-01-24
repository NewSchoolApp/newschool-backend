import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class Audit {
  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  @VersionColumn()
  version;
}
