import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'users_followers' })
export class UsersFollower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.following)
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  followed: User;

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
