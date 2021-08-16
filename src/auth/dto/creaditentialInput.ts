import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreditentialInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
