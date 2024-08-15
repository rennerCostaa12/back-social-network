import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { PostsSave } from 'src/posts-saves/entities/posts-save.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Reaction, PostsSave])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}
