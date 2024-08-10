import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('comment'))
  create(
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() comment: Express.Multer.File,
  ) {
    return this.commentsService.create(createCommentDto, comment);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Headers() headers: any) {

    const idUser = headers.id_user;
    return this.commentsService.remove(id, idUser);
  }

  @Get('find-comment-by-post/:id')
  findByPost(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findCommentByPost(id);
  }
}
