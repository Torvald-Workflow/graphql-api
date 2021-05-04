import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
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
        TypeOrmModule.forFeature([User]),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
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

    const user: User = await service.createDefaultAdminUser(
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
});
