import { PrimaryGeneratedColumn, ManyToOne, Column, Entity } from 'typeorm';
import { EmoticonsDriver } from 'src/emoticons-driver/entities/emoticons-driver.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'reactions' })
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @ManyToOne(
    () => EmoticonsDriver,
    (emoticonsDriver) => emoticonsDriver.reactions,
  )
  emoticons_driver: EmoticonsDriver;

  @ManyToOne(() => Post, (post) => post.reactions)
  post: Post;

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
