import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { jwtConstants } from '../auth/constants';
import { TypeOrmConfigService } from '../config.service';
import { adminUser, adminUserDto, localUser, userDto } from '../test/helper';
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
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
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
    const user = await service.create(userDto());

    expect(user).toMatchObject({
      email: localUser.getEmail(),
      firstName: localUser.getFirstName(),
      lastName: localUser.getLastName(),
      isActive: true,
    });
  });

  it('Should create a default admin user in database', async () => {
    const user: UserEntity = await service.createDefaultAdminUser(
      adminUserDto(),
    );

    expect(user).toMatchObject({
      email: adminUser.getEmail(),
      firstName: adminUser.getFirstName(),
      lastName: adminUser.getLastName(),
      isAdmin: true,
      isActive: true,
    });
  });

  it('Should fetch all users stored in database (total: 2)', async () => {
    const users = await service.findAll();

    expect(users).toHaveLength(2);

    expect(users[0]).toMatchObject({
      firstName: localUser.getFirstName(),
      lastName: localUser.getLastName(),
      email: localUser.getEmail(),
      birthday: null,
      isAdmin: false,
      isActive: true,
      jobTitle: null,
    });

    expect(users[1]).toMatchObject({
      firstName: adminUser.getFirstName(),
      lastName: adminUser.getLastName(),
      email: adminUser.getEmail(),
      birthday: null,
      isAdmin: true,
      isActive: true,
      jobTitle: null,
    });
  });

  it('Should fetch admin user', async () => {
    const user = await service.findOne(adminUser.getEmail());

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
});
