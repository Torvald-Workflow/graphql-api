import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreditentialInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
