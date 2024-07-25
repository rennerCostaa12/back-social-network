import { Module } from '@nestjs/common';
import { UsersFollowersService } from './users-followers.service';
import { UsersFollowersController } from './users-followers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersFollower } from './entities/users-follower.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersFollower, User])],
  controllers: [UsersFollowersController],
  providers: [UsersFollowersService],
})
export class UsersFollowersModule {}
