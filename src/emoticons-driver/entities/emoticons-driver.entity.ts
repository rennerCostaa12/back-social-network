import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CategoriesEmoji } from 'src/categories-emojis/entities/categories-emoji.entity';

@Entity({ name: 'emoticons_driver' })
export class EmoticonsDriver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.emoticons_driver)
  user: User;

  @ManyToOne(() => CategoriesEmoji, (categories) => categories.emoticons_driver)
  category: CategoriesEmoji;

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
