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

describe('AuthResolver', () => {
  let resolver: AuthResolver;
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

    resolver = module.get<AuthResolver>(AuthResolver);
    userService = module.get<UsersService>(UsersService);

    await getConnection().dropDatabase();
    await getConnection().runMigrations();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
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

  it('Should not login user with wrong email', async () => {
    const email = 'john.doe@test.fr';
    const password = 'adminpassword';

    try {
      await resolver.login({ email, password });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.response.message).toBe('Unauthorized');
    }
  });

  it('Should not login user with wrong password', async () => {
    const email = 'admin@test.fr';
    const password = 'adminpasswords';

    try {
      await resolver.login({ email, password });
      expect(true).toBe(false);
    } catch (e) {
      expect(e.response.message).toBe('Unauthorized');
    }
  });

  it('Should login admin user', async () => {
    const email = 'admin@test.fr';
    const firstName = 'Admin';
    const lastName = 'Admin';
    const password = 'adminpassword';

    const loggedIn = await resolver.login({ email, password });

    expect(loggedIn).toHaveProperty('token');

    expect(loggedIn).toMatchObject({
      user: {
        email,
        firstName,
        lastName,
        isAdmin: true,
      },
    });
  });
});
