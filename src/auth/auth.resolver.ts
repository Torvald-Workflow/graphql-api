import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './dto/authenticatedUser.output';
import { CreditentialInput } from './dto/creaditentialInput';
import { LocalAuthGuard } from './local-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => AuthenticatedUser)
  async login(
    @Args('creditentials') creditentials: CreditentialInput,
  ): Promise<AuthenticatedUser> {
    const user = await this.authService.validateUser(
      creditentials.username,
      creditentials.password,
    );

    const token = await this.authService.login(user);

    return { ...user, token: token.access_token };
  }
}
