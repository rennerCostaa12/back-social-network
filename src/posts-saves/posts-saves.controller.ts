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
  create(@Body() createPostsSaveDto: CreatePostsSaveDto) {
    return this.postsSavesService.create(createPostsSaveDto);
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
  ) {
    return this.postsSavesService.update(+id, updatePostsSaveDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.postsSavesService.remove(+id);
  }
}
