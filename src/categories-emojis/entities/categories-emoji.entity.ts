import { Emoticon } from 'src/emoticons/entities/emoticon.entity';
import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';

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
