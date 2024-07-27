import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Users } from 'src/constants/Users/users';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userFinded = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    });

    if (userFinded?.username === createUserDto.username) {
      throw new HttpException(
        'Já existe um usuário com esse nome de usuário. Por favr escolha outro',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();

    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      status: Users.active,
    });
    return this.usersRepository.save(user);
  }

  findAll() {
    this.usersRepository.find();
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    const userFinded = await this.usersRepository.findOneBy({ id });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return userFinded;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userFinded = await this.usersRepository.findOneBy({ id });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const usersUpdated = this.usersRepository.update(id, {
      ...updateUserDto,
      updated_at: new Date(),
    });

    return usersUpdated;
  }
}
