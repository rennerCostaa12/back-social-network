import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Headers,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostsSavesService } from './posts-saves.service';
import { CreatePostsSaveDto } from './dto/create-posts-save.dto';
import { UpdatePostsSaveDto } from './dto/update-posts-save.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('posts-saves')
export class PostsSavesController {
  constructor(private readonly postsSavesService: PostsSavesService) {}

  @Post()
  create(
    @Body() createPostsSaveDto: CreatePostsSaveDto,
    @Headers() headers: any,
  ) {
    const id_user = headers.id_user;
    return this.postsSavesService.create(createPostsSaveDto, id_user);
  }

  @Get()
  findAll() {
    return this.postsSavesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.postsSavesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updatePostsSaveDto: UpdatePostsSaveDto,
    @Headers() headers: any,
  ) {
    const id_user = headers.id_user;
    return this.postsSavesService.update(+id, updatePostsSaveDto, id_user);
  }

  @Delete(':idPost')
  remove(@Param('idPost', ParseUUIDPipe) id: string, @Headers() headers: any) {
    const id_user = headers.id_user;
    return this.postsSavesService.remove(id, id_user);
  }
}
