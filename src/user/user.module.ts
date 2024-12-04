import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from 'src/user/entities/user.entity';
import { PasswordHelper } from './password.helper';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { JwtModule } from 'src/utils/jwt.module';
import { AuthResolver } from './auth.resolver';
import { UserResolver } from './user.resolver';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), JwtModule],
  providers: [
    UserService,
    RoleService,
    PasswordHelper,
    AuthResolver,
    UserResolver,
    UserSubscriber,
  ],
  exports: [UserService],
})
export class UserModule {}
