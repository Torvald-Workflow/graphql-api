import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfigurationService } from '../configuration/configuration.service';
import { InstallationGuard } from '../configuration/guards/installation.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly configurationService: ConfigurationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async createUser(@Args('user') data: CreateUserDto): Promise<User> {
    return await this.usersService.create(data);
  }

  @UseGuards(InstallationGuard)
  @Mutation(() => User)
  async createDefaultAdminUser(
    @Args('user') data: CreateUserDto,
  ): Promise<User> {
    const user = await this.usersService.createDefaultAdminUser(data);
    await this.configurationService.unsetRequireInstallation();
    return user;
  }
}
