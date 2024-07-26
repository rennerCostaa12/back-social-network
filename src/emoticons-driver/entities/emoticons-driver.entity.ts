import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CategoriesEmoji } from 'src/categories-emojis/entities/categories-emoji.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';

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

  @OneToMany(() => Reaction, ((reactions) => reactions.emoticons_driver))
  reactions: Reaction[];

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
