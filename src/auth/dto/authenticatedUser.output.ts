import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthenticatedUser {
  @Field()
  user: string;

  @Field()
  token: string;
}
