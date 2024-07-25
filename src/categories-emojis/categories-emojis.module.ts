import { Module } from '@nestjs/common';
import { CategoriesEmojisService } from './categories-emojis.service';
import { CategoriesEmojisController } from './categories-emojis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEmoji } from './entities/categories-emoji.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesEmoji])],
  controllers: [CategoriesEmojisController],
  providers: [CategoriesEmojisService],
})
export class CategoriesEmojisModule {}
