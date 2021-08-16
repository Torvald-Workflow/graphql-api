import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Configuration } from './configuration.model';
import { ConfigurationService } from './configuration.service';

@Resolver()
export class ConfigurationResolver {
  constructor(private readonly configurationService: ConfigurationService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Configuration])
  async fetchConfigurations(): Promise<Configuration[]> {
    return await this.configurationService.getConfigurations();
  }
}
