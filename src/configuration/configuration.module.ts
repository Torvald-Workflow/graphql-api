import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationResolver } from './configuration.resolver';
import { ConfigurationService } from './configuration.service';
import { ConfigurationEntity } from './entity/configuration.entity';

@Module({
  providers: [ConfigurationResolver, ConfigurationService],
  exports: [ConfigurationService],
  imports: [TypeOrmModule.forFeature([ConfigurationEntity])],
})
export class ConfigurationModule {}
