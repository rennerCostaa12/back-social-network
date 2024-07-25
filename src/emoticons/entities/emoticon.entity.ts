import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { CategoriesEmoji } from 'src/categories-emojis/entities/categories-emoji.entity';

@Entity({ name: 'emoticons' })
export class Emoticon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  image: string;

  @Column({ length: 255 })
  description: string;

  @Column({ unique: true })
  order: number;

  @ManyToOne(() => CategoriesEmoji, (categoriesEmoji) => categoriesEmoji.emoticons, { nullable: false })
  categories_emoji: CategoriesEmoji;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
