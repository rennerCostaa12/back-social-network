import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Users } from 'src/constants/Users/users';

import * as bcrypt from 'bcrypt';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { UsersFollower } from 'src/users-followers/entities/users-follower.entity';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    @InjectRepository(UsersFollower)
    private readonly usersFollowerRepository: Repository<UsersFollower>,
  ) {}

  async uploadFileS3(fileName: string, file: Buffer, bucket: string) {
    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ACL: 'public-read',
      }),
    );
  }

  async create(createUserDto: CreateUserDto, image: Express.Multer.File) {
    const userFinded = await this.usersRepository.findOneBy({
      username: createUserDto.username,
    });

    if (userFinded?.username === createUserDto.username) {
      throw new HttpException(
        'Já existe um usuário com esse nome de usuário. Por favr escolha outro',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.uploadFileS3(
      image.originalname,
      image.buffer,
      'social-network-mobility-pro-teste',
    );

    const url_profile_photo = `https://social-network-mobility-pro-teste.s3.amazonaws.com/${image.originalname}`;

    const salt = await bcrypt.genSalt();

    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      status: Users.active,
      photo_profile: url_profile_photo,
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    photo_profile: Express.Multer.File,
  ) {
    const userFinded = await this.usersRepository.findOneBy({ id });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    if (photo_profile) {
      await this.uploadFileS3(
        photo_profile.originalname,
        photo_profile.buffer,
        'social-network-mobility-pro-teste',
      );
    }

    const url_profile_photo = photo_profile
      ? `https://social-network-mobility-pro-teste.s3.amazonaws.com/${photo_profile.originalname}`
      : userFinded.photo_profile;

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    await this.usersRepository.update(id, {
      ...updateUserDto,
      photo_profile: url_profile_photo,
      updated_at: new Date(),
    });

    return {
      user: { ...updateUserDto, photo_profile: url_profile_photo },
    };
  }

  async getFollowersCount(userId: User): Promise<number> {
    return await this.usersFollowerRepository
      .createQueryBuilder('usersfollowers')
      .where('usersfollowers.followedId = :userId', { userId })
      .getCount();
  }

  async getFollowingCount(userId: User): Promise<number> {
    return await this.usersFollowerRepository
      .createQueryBuilder('usersfollowers')
      .where('usersfollowers.followerId = :userId', { userId })
      .getCount();
  }

  async searchUsers(
    nameUser: string,
    limit: number,
    page: number,
  ): Promise<Pagination<any>> {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.name LIKE :nameUser OR user.username LIKE :nameUser', {
        nameUser: `%${nameUser}%`,
      });

    const usersPagination = await paginate<any>(users as any, { limit, page });

    const listUsersWithCountFollowers = await Promise.all(
      usersPagination.items.map(async (value) => {
        const followerCount = await this.getFollowersCount(value.id);
        const followingCount = await this.getFollowingCount(value.id);

        const usersFollows = { ...value, followerCount, followingCount };

        return usersFollows;
      }),
    );

    return { ...usersPagination, items: listUsersWithCountFollowers };
  }
}
