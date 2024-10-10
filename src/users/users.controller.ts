import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.usersService.create(createUserDto, image);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('find-new-users')
  findNewUsers(@Headers() headers: any) {
    const userId = headers.id_user;
    return this.usersService.getNewUsers(userId);
  }

  @UseGuards(AuthGuard)
  @Get('users-recommended')
  usersRecommended(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number = 15,
    @Headers() headers: any,
  ) {
    const userId = headers.id_user;
    return this.usersService.findRecommendedUsers(userId, limit, page);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Headers() headers: any) {
    const userId = headers.id_user;
    return this.usersService.findOne(id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, callback) => callback(null, true),
    }),
  )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto, image);
  }

  @UseGuards(AuthGuard)
  @Get('find-user/:name')
  searchUsers(@Param('name') name: string, @Headers() headers: any) {
    const userId = headers.id_user;
    return this.usersService.searchUsers(name, userId);
  }

  @UseGuards(AuthGuard)
  @Get('find-user-pagination/:name')
  searchUsersPagination(
    @Param('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
    @Headers() headers: any,
  ) {
    const userId = headers.id_user;
    return this.usersService.searchUsersPagination(name, limit, page, userId);
  }
}
