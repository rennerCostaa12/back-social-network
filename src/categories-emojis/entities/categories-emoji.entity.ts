import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Emoticon } from 'src/emoticons/entities/emoticon.entity';
import { EmoticonsDriver } from 'src/emoticons-driver/entities/emoticons-driver.entity';

@Entity({ name: 'categories_emojis' })
export class CategoriesEmoji {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string | null;

  @Column()
  image: string;

  @OneToMany(() => Emoticon, (emoticon) => emoticon.categories_emoji)
  emoticons: Emoticon[];

  @OneToMany(() => EmoticonsDriver, (emoticon) => emoticon.category)
  emoticons_driver: EmoticonsDriver[];

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
