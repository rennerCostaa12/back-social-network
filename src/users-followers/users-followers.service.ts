import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsersFollowerDto } from './dto/create-users-follower.dto';
import { UpdateUsersFollowerDto } from './dto/update-users-follower.dto';
import { UnfollowingUsersFollowingDto } from './dto/unfollowing-users-followers.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersFollower } from './entities/users-follower.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersFollowersService {
  constructor(
    @InjectRepository(UsersFollower)
    private usersFollowersRepository: Repository<UsersFollower>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUsersFollowerDto: CreateUsersFollowerDto) {
    if (createUsersFollowerDto.followed === createUsersFollowerDto.follower) {
      throw new HttpException(
        'Usuários do mesmo id não podem se seguir',
        HttpStatus.BAD_REQUEST,
      );
    }

    const findFollower = await this.usersRepository.findOneBy({
      id: createUsersFollowerDto.follower,
    });

    if (!findFollower) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const findFollowed = await this.usersRepository.findOneBy({
      id: createUsersFollowerDto.followed,
    });

    if (!findFollowed) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const usersFollowers = this.usersFollowersRepository.create(
      createUsersFollowerDto,
    );
    return this.usersFollowersRepository.save(usersFollowers);
  }

  async remove(id: string) {
    return await this.usersFollowersRepository.delete(id);
  }

  async getFollowersCount(userId: User): Promise<number> {
    return await this.usersFollowersRepository
      .createQueryBuilder('usersfollowers')
      .where('usersfollowers.followedId = :userId', { userId })
      .getCount();
  }

  async getFollowingCount(userId: User): Promise<number> {
    return await this.usersFollowersRepository
      .createQueryBuilder('usersfollowers')
      .where('usersfollowers.followerId = :userId', { userId })
      .getCount();
  }

  async findFollowersByUserCount(id: User) {
    const userFinded = await this.usersRepository.findOneBy({ id: id as any });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const followers = await this.getFollowersCount(id);
    const following = await this.getFollowingCount(id);

    return {
      followers,
      following,
    };
  }

  async getFollowersDetails(userId: User): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.following', 'follow', 'follow.followedId = :userId', {
        userId,
      })
      .getMany();
  }

  async getFollowingDetails(userId: User): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.followers', 'follow', 'follow.followerId = :userId', {
        userId,
      })
      .getMany();
  }

  async findFollowersDetails(id: User) {
    const userFinded = await this.usersRepository.findOneBy({ id: id as any });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const followersDetails = await this.getFollowersDetails(id);
    return followersDetails;
  }

  async findFollowingDetails(id: User) {
    const userFinded = await this.usersRepository.findOneBy({ id: id as any });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const followingDetails = await this.getFollowingDetails(id);
    return followingDetails;
  }

  async unfollowingUser(
    id: string,
    unfollowingUsersFollowers: UnfollowingUsersFollowingDto,
  ) {
    const { userId } = unfollowingUsersFollowers;

    const userFinded = await this.usersRepository.findOneBy({ id });

    if (!userFinded) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const userUnfollowing = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!userUnfollowing) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const result = await this.usersFollowersRepository
      .createQueryBuilder('usersfollowers')
      .where('usersfollowers.followerId = :id', { id })
      .andWhere('usersfollowers.followedId = :userId', { userId })
      .getOne();

    if (!result) {
      throw new HttpException(
        'Não foi encontrado nenhuma relação entre esses dois usuários',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.remove(result.id);
    return { message: 'Unfollow realizado com sucesso' };
  }
}
