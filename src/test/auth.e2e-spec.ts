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
});
