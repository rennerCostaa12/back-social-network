import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async comparePassword(password: string, hash: string) {
    const isMatchPasswords = await bcrypt.compare(password, hash);
    return isMatchPasswords;
  }

  async login(dataUser: LoginDto) {
    const userInfomations = await this.usersRepository.findOneBy({
      username: dataUser.username,
    });

    if (!userInfomations) {
      throw new HttpException(
        'Username/Senha inválida',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (
      !(await this.comparePassword(dataUser.password, userInfomations.password))
    ) {
      throw new HttpException(
        'Username/Senha inválida',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      id: userInfomations.id,
      name: userInfomations.name,
      username: userInfomations.username,
      gender: userInfomations.gender,
      description: userInfomations.description,
      photo_profile: userInfomations.photo_profile,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1 days',
        subject: String(userInfomations.id),
        audience: 'user',
      }),
      user: payload,
    };
  }
}
