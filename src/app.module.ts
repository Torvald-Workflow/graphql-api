import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './config.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    ConfigurationModule,
    UsersModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [TypeOrmConfigService],
      useClass: TypeOrmConfigService,
    }),
    ProjectsModule,
  ],
})
export class AppModule {}
