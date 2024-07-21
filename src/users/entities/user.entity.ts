import { Comment } from 'src/comments/entities/comment.entity';
import { PostsSave } from 'src/posts-saves/entities/posts-save.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  description: string | null;

  @Column()
  password: string;

  @Column()
  status: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostsSave, (postSave) => postSave.user)
  posts_save: PostsSave[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

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
