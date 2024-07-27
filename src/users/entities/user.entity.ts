import { Comment } from 'src/comments/entities/comment.entity';
import { PostsSave } from 'src/posts-saves/entities/posts-save.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UsersFollower } from 'src/users-followers/entities/users-follower.entity';
import { EmoticonsDriver } from 'src/emoticons-driver/entities/emoticons-driver.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  description: string | null;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column()
  photo_profile: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostsSave, (postSave) => postSave.user)
  posts_save: PostsSave[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => UsersFollower, (usersFollowrs) => usersFollowrs.follower)
  following: UsersFollower[];

  @OneToMany(() => UsersFollower, (usersFollowrs) => usersFollowrs.followed)
  followers: UsersFollower[];

  @OneToMany(() => EmoticonsDriver, (usersFollowrs) => usersFollowrs.user)
  emoticons_driver: EmoticonsDriver[];

  @OneToMany(() => Reaction, ((reactions) => reactions.user))
  reactions: Reaction[];

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
