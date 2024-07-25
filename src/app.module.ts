import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { StatusPostsModule } from './status-posts/status-posts.module';
import { PostsModule } from './posts/posts.module';
import { PostsSavesModule } from './posts-saves/posts-saves.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesEmojisModule } from './categories-emojis/categories-emojis.module';
import { EmoticonsModule } from './emoticons/emoticons.module';
import { UsersFollowersModule } from './users-followers/users-followers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          UsersModule,
          StatusPostsModule,
          PostsModule,
          PostsSavesModule,
          CommentsModule,
          CategoriesEmojisModule,
          EmoticonsModule,
          UsersFollowersModule,
        ],
        autoLoadEntities: true
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    StatusPostsModule,
    PostsModule,
    PostsSavesModule,
    CommentsModule,
    CategoriesEmojisModule,
    EmoticonsModule,
    UsersFollowersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
