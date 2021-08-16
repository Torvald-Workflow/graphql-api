import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigurationEntity } from './entity/configuration.entity';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectRepository(ConfigurationEntity)
    private configurationRepository: Repository<ConfigurationEntity>,
  ) {}

  async isApplicationRequireInstallation(): Promise<boolean> {
    const requireInstallation = await this.configurationRepository.findOne({
      section: 'global',
      name: 'requireInstallation',
    });

    return requireInstallation.value === 'true';
  }

  async unsetRequireInstallation(): Promise<ConfigurationEntity> {
    const configuration = await this.configurationRepository.findOne({
      section: 'global',
      name: 'requireInstallation',
    });

    configuration.value = 'false';

    return this.configurationRepository.save(configuration);
  }

  async getConfigurations(): Promise<ConfigurationEntity[]> {
    return await this.configurationRepository.find();
  }
}
