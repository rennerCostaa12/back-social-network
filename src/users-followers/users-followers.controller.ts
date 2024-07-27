import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersFollowersService } from './users-followers.service';
import { CreateUsersFollowerDto } from './dto/create-users-follower.dto';
import { User } from 'src/users/entities/user.entity';
import { UnfollowingUsersFollowingDto } from './dto/unfollowing-users-followers.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users-followers')
export class UsersFollowersController {
  constructor(private readonly usersFollowersService: UsersFollowersService) {}

  @Post()
  create(@Body() createUsersFollowerDto: CreateUsersFollowerDto) {
    return this.usersFollowersService.create(createUsersFollowerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersFollowersService.remove(id);
  }

  @Get('find-by-user/:id')
  findByUser(@Param('id', ParseUUIDPipe) id: User) {
    return this.usersFollowersService.findFollowersByUserCount(id);
  }

  @Get('find-following-by-user/:id')
  findFollowingsDetailsByUser(@Param('id', ParseUUIDPipe) id: User) {
    return this.usersFollowersService.findFollowingDetails(id);
  }

  @Get('find-followers-by-user/:id')
  findFollowersDetailsByUser(@Param('id', ParseUUIDPipe) id: User) {
    return this.usersFollowersService.findFollowersDetails(id);
  }

  @Post('unfollow-user/:id')
  @HttpCode(200)
  unfollowUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() unfollowUserDto: UnfollowingUsersFollowingDto,
  ) {
    return this.usersFollowersService.unfollowingUser(id, unfollowUserDto);
  }
}
