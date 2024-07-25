import { Module } from '@nestjs/common';
import { EmoticonsService } from './emoticons.service';
import { EmoticonsController } from './emoticons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emoticon } from './entities/emoticon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Emoticon])],
  controllers: [EmoticonsController],
  providers: [EmoticonsService],
})
export class EmoticonsModule {}
