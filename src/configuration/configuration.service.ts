import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entity/configuration.entity';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(Configuration)
    private configurationRepository: Repository<Configuration>,
  ) {}

  async isApplicationRequireInstallation(): Promise<boolean> {
    const requireInstallation = await this.configurationRepository.findOne({
      section: 'global',
      name: 'requireInstallation',
    });

    return requireInstallation.value === 'true';
  }

  async unsetRequireInstallation(): Promise<Configuration> {
    const configuration = await this.configurationRepository.findOne({
      section: 'global',
      name: 'requireInstallation',
    });

    configuration.value = 'false';

    return this.configurationRepository.save(configuration);
  }

  async getConfigurations(): Promise<Configuration[]> {
    return await this.configurationRepository.find();
  }
}
