import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/user.model';

@ObjectType()
export class AuthenticatedUser {
  @Field()
  user: User;

  @Field()
  token: string;
}
