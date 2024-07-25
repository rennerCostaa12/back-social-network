import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersFollowerDto } from './create-users-follower.dto';

export class UpdateUsersFollowerDto extends PartialType(CreateUsersFollowerDto) {}
