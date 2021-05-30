import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { TypeOrmConfigService } from '../config.service';
import { UserEntity } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

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

    await getConnection().dropDatabase();
    await getConnection().runMigrations();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
