import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { TypeOrmConfigService } from '../config.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { UserEntity } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, AuthResolver, JwtStrategy],
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
        TypeOrmModule.forRootAsync({
          name: 'default',
          imports: [TypeOrmConfigService],
          useClass: TypeOrmConfigService,
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);

    await getConnection().dropDatabase();
    await getConnection().runMigrations();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    const user: UserEntity = await userService.createDefaultAdminUser(
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

  it('Should not validate another user', async () => {
    const email = 'john.doe@test.fr';
    const password = 'adminpassword';

    const validatedUser = await service.validateUser(email, password);

    expect(validatedUser).toBeNull();
  });

  it('Should not validate admin user with wrong password', async () => {
    const email = 'admin@test.fr';
    const password = 'adminpasswords';

    const validatedUser = await service.validateUser(email, password);

    expect(validatedUser).toBeNull();
  });

  it('Should not validate admin user', async () => {
    const email = 'admin@test.fr';
    const firstName = 'Admin';
    const lastName = 'Admin';
    const password = 'adminpassword';

    const validatedUser = await service.validateUser(email, password);

    expect(validatedUser).toMatchObject({
      email,
      firstName,
      lastName,
      isAdmin: true,
    });
  });

  it('Should login specified user', async () => {
    const email = 'admin@test.fr';

    const user = await userService.findOne(email);

    const login = await service.login(user);

    expect(login).toHaveProperty('access_token');
  });
});
