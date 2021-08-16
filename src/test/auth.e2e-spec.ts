import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { AppModule } from '../app.module';

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
      login(creditentials: {email: "ql2697@gmail.com", password: "123aze+++"}) {
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
    const email = 'ql2697@gmail.com';
    const password = '123aze+++';
    const firstName = 'Quentin';
    const lastName = 'LAURENT';

    const createDefaultAdminUserRequest = `
    mutation {
      createDefaultAdminUser(user: {email: "${email}", firstName: "${firstName}", lastName: "${lastName}", password: "${password}"}) {
        email
      }
    }`;

    const response = await request(app.getHttpServer()).post('/graphql').send({
      query: createDefaultAdminUserRequest,
    });

    expect(response.body.data.createDefaultAdminUser).toMatchObject({
      email: email,
    });
  });

  it('Check that user now can login with admin account', async () => {
    const email = 'ql2697@gmail.com';
    const password = '123aze+++';
    const firstName = 'Quentin';
    const lastName = 'LAURENT';

    const loginRequest = `
    mutation {
      login(creditentials: { email: "${email}", password: "${password}" }) {
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
      email,
      firstName,
      lastName,
      isAdmin: true,
    });
  });
});
