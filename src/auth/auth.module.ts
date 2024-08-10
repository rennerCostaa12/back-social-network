import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { secretJwt } from 'src/constants/Auth/secret';
import { EmoticonsDriver } from 'src/emoticons-driver/entities/emoticons-driver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmoticonsDriver]),
    JwtModule.register({
      global: true,
      secret: secretJwt,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
