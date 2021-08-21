import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/user.model';

@ObjectType()
export class Project {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  slug: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [User])
  users: User[];
}
