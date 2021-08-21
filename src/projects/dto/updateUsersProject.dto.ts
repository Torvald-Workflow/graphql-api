import { Field, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@InputType()
export class UpdateUsersProjectDto {
  @Field()
  @IsArray()
  users: string[];
}
