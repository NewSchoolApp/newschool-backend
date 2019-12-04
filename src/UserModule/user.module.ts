import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository';
import { User } from './entity';
import { UserMapper } from './mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports: [UserService],
})
export class UserModule {
}
