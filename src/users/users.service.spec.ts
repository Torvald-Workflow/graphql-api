import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { TypeOrmConfigService } from '../config.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [
        TypeOrmModule.forRootAsync({
          name: 'default',
          imports: [TypeOrmConfigService],
          useClass: TypeOrmConfigService,
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    await getConnection().dropDatabase();
    await getConnection().runMigrations();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should give 0 users when fetching all', async () => {
    const users = await service.findAll();

    expect(users.length).toEqual(0);
  });

  it('Should return undefined when trying to fetch a non-existing user', async () => {
    const user = await service.findOne('afac34c4-dd7b-4240-a242-46c766f74c03');

    expect(user).toBeUndefined();
  });

  it('Should create a user in database', async () => {
    const email = 'test@test.fr';
    const firstName = 'John';
    const lastName = 'Doe';
    const password = 'testpassword';

    const createUserParameters: CreateUserDto = {
      email,
      firstName,
      lastName,
      password,
    };

    const user = await service.create(createUserParameters);

    expect(user).toMatchObject({
      email,
      firstName,
      lastName,
      isActive: true,
    });
  });

  it('Should create a default admin user in database', async () => {
    const email = 'admin@test.fr';
    const firstName = 'Admin';
    const lastName = 'Admin';
    const password = 'adminpassword';

    const createUserParameters: CreateUserDto = {
      email,
      firstName,
      lastName,
      password,
    };

    const user: UserEntity = await service.createDefaultAdminUser(
      createUserParameters,
    );

    expect(user).toMatchObject({
      email,
      firstName,
      lastName,
      isAdmin: true,
      isActive: true,
    });
  });

  it('Should fetch all users stored in database (total: 2)', async () => {
    const users = await service.findAll();

    expect(users).toHaveLength(2);

    expect(users[0]).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.fr',
      birthday: null,
      isAdmin: false,
      isActive: true,
      jobTitle: null,
    });

    expect(users[1]).toMatchObject({
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@test.fr',
      birthday: null,
      isAdmin: true,
      isActive: true,
      jobTitle: null,
    });
  });

  it('Should fetch admin user', async () => {
    const user = await service.findOne('admin@test.fr');

    expect(user).toMatchObject({
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@test.fr',
      birthday: null,
      isAdmin: true,
      isActive: true,
      jobTitle: null,
    });
  });
});
