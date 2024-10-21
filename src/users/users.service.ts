import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { Between, Not } from 'typeorm';
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

import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_ENDPOINT,
    forcePathStyle: true,
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

    const fileName = `users/photos_profile/${image.originalname}.png`;

    await this.uploadFileS3(fileName, image.buffer, process.env.AWS_BUCKET);

    const url_profile_photo = `${process.env.AWS_ENDPOINT}${process.env.AWS_BUCKET}/users/photos_profile/${image.originalname}.png`;

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

  async findOne(id: string, userId: string) {
    const userFinded = await this.usersRepository.findOneBy({ id });

    const isFollowingUser = await this.usersFollowerRepository
      .createQueryBuilder('usersFollowers')
      .where('usersFollowers.followerId = :userId', { userId })
      .andWhere('usersFollowers.followedId = :id', { id })
      .getOne();

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return {
      ...userFinded,
      isFollowing: isFollowingUser !== null ? true : false,
    };
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

    const fileName = `users/photos_profile/${photo_profile.originalname}.png`;

    if (photo_profile) {
      await this.uploadFileS3(
        fileName,
        photo_profile.buffer,
        process.env.AWS_BUCKET,
      );
    }

    const url_profile_photo = photo_profile
      ? `${process.env.AWS_ENDPOINT}${process.env.AWS_BUCKET}/users/photos_profile/${photo_profile.originalname}.png`
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

  async getFollowingDetails(userId: string): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.followers', 'follow', 'follow.followerId = :userId', {
        userId,
      })
      .getMany();
  }

  async searchUsers(nameUser: string, user_id: string) {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.name LIKE :nameUser OR user.username LIKE :nameUser', {
        nameUser: `%${nameUser}%`,
      })
      .andWhere('user.id != :user_id', { user_id })
      .getMany();

    const usersFollowing = await this.getFollowingDetails(user_id);
    const idsUsersFolowing = usersFollowing.map((value) => {
      return value.id;
    });

    const usersWithCountFollowers = await Promise.all(
      users
        .filter((data) => data.id !== user_id)
        .map(async (value) => {
          const followerCount = await this.getFollowersCount(value.id as any);
          const followingCount = await this.getFollowingCount(value.id as any);

          const usersFollows = {
            ...value,
            followerCount,
            followingCount,
            isFollowing: idsUsersFolowing.includes(value.id),
          };

          return usersFollows;
        }),
    );

    return usersWithCountFollowers;
  }

  async searchUsersPagination(
    nameUser: string,
    limit: number,
    page: number,
    userId: string,
  ) {
    const offset = (page - 1) * limit;

    const totalUsers = await this.usersRepository
      .createQueryBuilder('user')
      .where('(user.name LIKE :nameUser OR user.username LIKE :nameUser)', {
        nameUser: `%${nameUser}%`,
      })
      .andWhere('user.id != :userId', { userId: userId })
      .getCount();

    const usersQuery = await this.usersRepository
      .createQueryBuilder('user')
      .where('(user.name LIKE :nameUser OR user.username LIKE :nameUser)', {
        nameUser: `%${nameUser}%`,
      })
      .andWhere('user.id != :userId', { userId: userId })
      .skip(offset)
      .take(limit)
      .getMany();

    const usersFollowing = await this.getFollowingDetails(userId);
    const idsUsersFolowing = usersFollowing.map((value) => {
      return value.id;
    });

    const listUsersWithCountFollowers = await Promise.all(
      usersQuery.map(async (value) => {
        const followerCount = await this.getFollowersCount(value.id as any);
        const followingCount = await this.getFollowingCount(value.id as any);

        const usersFollows = {
          ...value,
          followerCount,
          followingCount,
          isFollowing: idsUsersFolowing.includes(value.id),
        };

        return usersFollows;
      }),
    );

    const totalPages = Math.ceil(totalUsers / limit);

    const meta = {
      totalItems: totalUsers,
      itemCount: listUsersWithCountFollowers.length,
      itemsPerPage: limit,
      totalPages: totalPages,
      currentPage: page,
    };

    return { items: listUsersWithCountFollowers, meta };
  }

  async getNewUsers(idUser: string) {
    const initDate = new Date();
    const endDate = new Date();

    initDate.setMonth(initDate.getMonth() - 1);
    initDate.setHours(0, 0, 0, 0);

    endDate.setHours(23, 59, 59, 999);

    const getUsers = await this.usersRepository.find({
      select: [
        'id',
        'name',
        'username',
        'gender',
        'description',
        'photo_profile',
        'created_at',
        'updated_at',
      ],
      where: {
        id: Not(idUser),
        status: Users.active,
        created_at: Between(initDate, endDate),
      },
    });

    return getUsers;
  }

  async findRecommendedUsers(userId: string, limit: number, page: number) {
    const usersFollowing = await this.getFollowingDetails(userId);
    const idsUsersFolowing = usersFollowing.map((value) => {
      return value.id;
    });

    let responseUsers = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.username',
        'user.gender',
        'user.description',
        'user.status',
        'user.photo_profile',
        'user.created_at',
        'user.updated_at',
      ])
      .where('user.id != :userId', { userId })
      .groupBy('user.id')
      .orderBy('user.created_at', 'DESC');

    if (idsUsersFolowing.length > 0) {
      responseUsers.andWhere('user.id NOT IN (:...followingIds)', {
        followingIds: idsUsersFolowing,
      });
    }

    const listUsersFinded = await paginate(responseUsers, { limit, page });

    return listUsersFinded;
  }
}
