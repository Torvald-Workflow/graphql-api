import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { TypeOrmConfigService } from '../config.service';
import { ConfigurationModule } from '../configuration/configuration.module';
import { adminUser, adminUserDto, localUser, userDto } from '../test/helper';
import { UserEntity } from './user.entity';
import { User } from './user.model';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let app;

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

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Should create admin user', async () => {
    const user: User = await resolver.createDefaultAdminUser(adminUserDto());

    expect(user).toMatchObject({
      firstName: adminUser.getFirstName(),
      lastName: adminUser.getLastName(),
      email: adminUser.getEmail(),
      birthday: null,
      isAdmin: true,
      isActive: true,
      jobTitle: null,
    });
  });

  it('Should not create the same admin user', async () => {
    try {
      await resolver.createUser(adminUserDto());
      expect(true).toBe(false);
    } catch (e) {
      expect(e.response.error).toBe('Bad Request');
    }
  });

  it('Should create user', async () => {
    const user: User = await resolver.createUser(userDto());

    expect(user).toMatchObject({
      firstName: localUser.getFirstName(),
      lastName: localUser.getLastName(),
      email: localUser.getEmail(),
      birthday: null,
      isAdmin: false,
      isActive: true,
      jobTitle: null,
    });
  });

  it('Should not create the same user', async () => {
    try {
      await resolver.createUser(adminUserDto());
      expect(true).toBe(false);
    } catch (e) {
      expect(e.response.error).toBe('Bad Request');
    }
  });

  it('Should fetch all users', async () => {
    const users = await resolver.fetchAllUsers();

    expect(users).toHaveLength(2);

    expect(users[0]).toMatchObject({
      firstName: adminUser.getFirstName(),
      lastName: adminUser.getLastName(),
      email: adminUser.getEmail(),
      birthday: null,
      isAdmin: true,
      isActive: true,
      jobTitle: null,
    });

    expect(users[1]).toMatchObject({
      firstName: localUser.getFirstName(),
      lastName: localUser.getLastName(),
      email: localUser.getEmail(),
      birthday: null,
      isAdmin: false,
      isActive: true,
      jobTitle: null,
    });
  });

  it('Should reset database and test manual queries', async () => {
    await getConnection().dropDatabase();
    await getConnection().runMigrations();

    const createDefaultAdminUserQuery = `
    mutation {
      createDefaultAdminUser(user: {email: "ql2697@gmail.com", firstName: "Quentin", lastName: "LAURENT", password: "123aze+++"}) {
        email
      }
    }`;

    await request(app.getHttpServer()).post('/graphql').send({
      operationName: null,
      query: createDefaultAdminUserQuery,
    });
  });
});
