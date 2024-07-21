import { Module } from '@nestjs/common';
import { StatusPostsService } from './status-posts.service';
import { StatusPostsController } from './status-posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusPost } from './entities/status-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusPost])],
  controllers: [StatusPostsController],
  providers: [StatusPostsService],
})
export class StatusPostsModule {}
