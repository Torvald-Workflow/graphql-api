import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { TypeOrmConfigService } from '../config.service';
import { ConfigurationResolver } from './configuration.resolver';
import { ConfigurationService } from './configuration.service';
import { ConfigurationEntity } from './entity/configuration.entity';

describe('ConfigurationService', () => {
  let service: ConfigurationService;

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

    service = module.get<ConfigurationService>(ConfigurationService);

    await getConnection().dropDatabase();
    await getConnection().runMigrations();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should show that application requires installation', async () => {
    const configuration = await service.isApplicationRequireInstallation();

    expect(configuration).toEqual(true);
  });

  it('Should unset that application requires restart', async () => {
    const configuration = await service.unsetRequireInstallation();

    expect(configuration).toEqual({
      section: 'global',
      name: 'requireInstallation',
      value: 'false',
      type: 3,
    });
  });

  it("Should show that application doesn't requires installation", async () => {
    const configuration = await service.isApplicationRequireInstallation();

    expect(configuration).toEqual(false);
  });

  it('Should fetch all configurations for the application (total: 1)', async () => {
    const configuration = await service.getConfigurations();

    expect(configuration).toHaveLength(1);

    expect(configuration).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          section: 'global',
          name: 'requireInstallation',
          value: 'false',
          type: 3,
        }),
      ]),
    );
  });
});
