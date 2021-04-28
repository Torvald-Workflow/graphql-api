import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => String)
  helloWorld(): string {
    return 'Hello world';
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async createUser(@Args('user') data: CreateUserDto): Promise<User> {
    return await this.usersService.create(data);
  }
}
