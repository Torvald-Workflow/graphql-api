import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { TypeOrmConfigService } from '../config.service';
import { ConfigurationResolver } from './configuration.resolver';
import { ConfigurationService } from './configuration.service';
import { ConfigurationEntity } from './entity/configuration.entity';

describe('ConfigurationResolver', () => {
  let resolver: ConfigurationResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigurationResolver, ConfigurationService],
      imports: [
        TypeOrmModule.forRootAsync({
          name: 'default',
          imports: [TypeOrmConfigService],
          useClass: TypeOrmConfigService,
        }),
        TypeOrmModule.forFeature([ConfigurationEntity]),
      ],
    }).compile();

    resolver = module.get<ConfigurationResolver>(ConfigurationResolver);

    await getConnection().dropDatabase();
    await getConnection().runMigrations();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Should fetch all configuration of the application', async () => {
    const configuration = await resolver.fetchConfigurations();

    expect(configuration).toHaveLength(1);

    expect(configuration[0] instanceof ConfigurationEntity).toBe(true);

    expect(configuration).toEqual([
      {
        section: 'global',
        name: 'requireInstallation',
        value: 'true',
        type: 3,
      },
    ]);
  });
});
