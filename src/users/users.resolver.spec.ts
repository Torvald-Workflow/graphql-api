import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { TypeOrmConfigService } from '../config.service';
import { ConfigurationModule } from '../configuration/configuration.module';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { User } from './user.model';
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
        TypeOrmModule.forFeature([UserEntity]),
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

  it('Should create admin user', async () => {
    const email = 'admin@test.fr';
    const firstName = 'Admin';
    const lastName = 'Admin';
    const password = 'adminpassword';

    const createUserParameters: CreateUserDto = {
      firstName,
      lastName,
      email,
      password,
    };

    const user: User = await resolver.createDefaultAdminUser(
      createUserParameters,
    );

    expect(user).toMatchObject({
      firstName,
      lastName,
      email,
      birthday: null,
      isAdmin: true,
      isActive: true,
      jobTitle: null,
    });
  });

  it('Should not create the same admin user', async () => {
    const email = 'admin@test.fr';
    const firstName = 'Admin';
    const lastName = 'Admin';
    const password = 'adminpassword';

    const createUserParameters: CreateUserDto = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      await resolver.createUser(createUserParameters);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.response.error).toBe('Bad Request');
    }
  });

  it('Should create user', async () => {
    const email = 'test@test.fr';
    const firstName = 'Admin';
    const lastName = 'Admin';
    const password = 'adminpassword';

    const createUserParameters: CreateUserDto = {
      firstName,
      lastName,
      email,
      password,
    };

    const user: User = await resolver.createUser(createUserParameters);

    expect(user).toMatchObject({
      firstName,
      lastName,
      email,
      birthday: null,
      isAdmin: false,
      isActive: true,
      jobTitle: null,
    });
  });

  it('Should not create the same user', async () => {
    const email = 'admin@test.fr';
    const firstName = 'Admin';
    const lastName = 'Admin';
    const password = 'adminpassword';

    const createUserParameters: CreateUserDto = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      await resolver.createUser(createUserParameters);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.response.error).toBe('Bad Request');
    }
  });
});
