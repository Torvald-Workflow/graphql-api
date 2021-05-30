import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  birthday: Date;

  @Field()
  isAdmin: boolean;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  jobTitle: string;

  @Field()
  createdAt: Date;
}
