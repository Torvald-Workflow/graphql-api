import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Configuration {
  @Field()
  section: string;

  @Field()
  name: string;

  @Field()
  value: string;

  @Field()
  type: number;
}
