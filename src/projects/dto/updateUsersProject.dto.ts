import { Field, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { UserEntity } from 'src/users/user.entity';

@InputType()
export class UpdateUsersProjectDto {
  @Field()
  @IsArray()
  users: UserEntity[];
}
