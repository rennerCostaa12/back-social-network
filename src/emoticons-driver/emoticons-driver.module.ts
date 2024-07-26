import { Module } from '@nestjs/common';
import { EmoticonsDriverService } from './emoticons-driver.service';
import { EmoticonsDriverController } from './emoticons-driver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmoticonsDriver } from './entities/emoticons-driver.entity';
import { User } from 'src/users/entities/user.entity';
import { CategoriesEmoji } from 'src/categories-emojis/entities/categories-emoji.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmoticonsDriver, User, CategoriesEmoji])],
  controllers: [EmoticonsDriverController],
  providers: [EmoticonsDriverService],
})
export class EmoticonsDriverModule {}
