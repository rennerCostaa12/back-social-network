import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { User } from 'src/users/entities/user.entity';
import { EmoticonsDriver } from 'src/emoticons-driver/entities/emoticons-driver.entity';
import { Post } from 'src/posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, User, EmoticonsDriver, Post])],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
