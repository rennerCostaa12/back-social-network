import { Comment } from 'src/comments/entities/comment.entity';
import { PostsSave } from 'src/posts-saves/entities/posts-save.entity';
import { Reaction } from 'src/reactions/entities/reaction.entity';
import { StatusPost } from 'src/status-posts/entities/status-post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  picture: string;

  @Column()
  city_id: number;

  @Column()
  comment: string;

  @Column({ nullable: true })
  tags: string | null;

  @ManyToOne(() => User, (user) => user.posts)
  user: Post;

  @ManyToOne(() => StatusPost, (statusPost) => statusPost.posts)
  status_posts: Post;

  @OneToMany(() => PostsSave, (postSave) => postSave.post)
  posts_save: PostsSave[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Reaction, (reactions) => reactions.post)
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
