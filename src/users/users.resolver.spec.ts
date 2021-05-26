import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { TypeOrmConfigService } from '../config.service';
import { ConfigurationModule } from '../configuration/configuration.module';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UsersService],
      imports: [
        TypeOrmModule.forRootAsync({
          name: 'default',
          imports: [TypeOrmConfigService],
          useClass: TypeOrmConfigService,
        }),
        TypeOrmModule.forFeature([User]),
        ConfigurationModule,
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);

    await getConnection().dropDatabase();
    await getConnection().runMigrations();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Should not create user', async () => {
    const user: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'passw0rd',
    };

    const createUserResponse = await resolver.createUser(user);

    console.log(createUserResponse);
  });
});
