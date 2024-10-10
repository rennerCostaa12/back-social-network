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
  UploadedFiles,
  Headers,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture_post', maxCount: 1 },
      { name: 'comment', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles()
    files: {
      picture_post: Express.Multer.File[];
      comment: Express.Multer.File[];
    },
    @Body() createPostDto: CreatePostDto,
  ) {
    const { picture_post, comment } = files;

    return this.postsService.create(createPostDto, picture_post, comment);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('find-posts-feed')
  findPostsFromFollowingUsers(
    @Headers() headers: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
  ) {
    const idUserLoggedIn = headers.id_user;
    return this.postsService.findPostsFromFollowingUsers(
      idUserLoggedIn,
      limit,
      page,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Headers() headers: any) {
    const userId = headers.id_user;
    return this.postsService.findOne(id, userId);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'comment', maxCount: 1 },
    ]),
  )
  update(
    @UploadedFiles()
    files: {
      picture?: Express.Multer.File[];
      comment?: Express.Multer.File[];
    },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const { picture, comment } = files;

    return this.postsService.update(id, updatePostDto, picture, comment);
  }

  @Get('find-post-by-user/:id')
  findPostByUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers() headers: any,
  ) {
    const idUserLoggedIn = headers.id_user;
    return this.postsService.findPostByUser(id, idUserLoggedIn);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.remove(id);
  }
}
