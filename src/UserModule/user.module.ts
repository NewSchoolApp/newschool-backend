import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository';
import { User } from './entity';
import { UserMapper } from './mapper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports: [UserService],
})
export class UserModule {
}
