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
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { PostsSavesService } from './posts-saves.service';
import { CreatePostsSaveDto } from './dto/create-posts-save.dto';
import { UpdatePostsSaveDto } from './dto/update-posts-save.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';

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
  findAll(
    @Headers() headers: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    const id_user = headers.id_user;
    return this.postsSavesService.findAll(id_user, limit, page);
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
