import { Module } from '@nestjs/common';
import { PostsSavesService } from './posts-saves.service';
import { PostsSavesController } from './posts-saves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsSave } from './entities/posts-save.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostsSave, User, Post, Reaction])],
  controllers: [PostsSavesController],
  providers: [PostsSavesService],
})
export class PostsSavesModule {}
