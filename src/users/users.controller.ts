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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}

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
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post('uploadTest')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image: Express.Multer.File) {
    console.log(image);
  }
}
