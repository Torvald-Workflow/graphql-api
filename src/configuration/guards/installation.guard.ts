import { CanActivate, Injectable } from '@nestjs/common';
import { ConfigurationService } from '../configuration.service';

@Injectable()
export class InstallationGuard implements CanActivate {
  constructor(private readonly configurationService: ConfigurationService) {}

  async canActivate(): Promise<boolean> {
    return await this.configurationService.isApplicationRequireInstallation();
  }
}
