import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { AppModule } from '../app.module';
import { adminUser } from './helper';

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await getConnection().dropDatabase();
    await getConnection().runMigrations();
  });

  it('Check that user cannot login without account', async () => {
    const loginRequest = `
    mutation {
      login(creditentials: {email: "${adminUser.getEmail()}", password: "${adminUser.getPassword()}"}) {
        user {
          id
        }
        token
      }
    }`;

    const response = request(app.getHttpServer()).post('/graphql').send({
      query: loginRequest,
    });

    return await response.then((response) => {
      expect(response.body.errors[0].message).toEqual('Unauthorized');
    });
  });

  it('Should create a default admin user', async () => {
    const createDefaultAdminUserRequest = `
    mutation {
      createDefaultAdminUser(user: {email: "${adminUser.getEmail()}", firstName: "${adminUser.getFirstName()}", lastName: "${adminUser.getLastName()}", password: "${adminUser.getPassword()}"}) {
        email
      }
    }`;

    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: createDefaultAdminUserRequest,
    });

    expect(response.body.data.createDefaultAdminUser).toMatchObject({
      email: adminUser.getEmail(),
    });
  });

  it('Check that user now can login with admin account', async () => {
    const loginRequest = `
    mutation {
      login(creditentials: { email: "${adminUser.getEmail()}", password: "${adminUser.getPassword()}" }) {
        token
        user {
          email
          firstName
          lastName
          isAdmin
        }
      }
    }`;

    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: loginRequest,
    });

    expect(response.body.data.login).toHaveProperty('token');

    expect(response.body.data.login.user).toMatchObject({
      email: adminUser.getEmail(),
      firstName: adminUser.getFirstName(),
      lastName: adminUser.getLastName(),
      isAdmin: true,
    });
  });
});
