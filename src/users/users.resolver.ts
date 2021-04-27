import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver()
export class UsersResolver {
  @UseGuards(JwtAuthGuard)
  @Query(() => String)
  helloWorld(): string {
    return 'Hello world';
  }
}
