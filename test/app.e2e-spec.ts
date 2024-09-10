import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Application (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  afterAll(() => {
    jest.resetModules();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user.one@example.com', password: '1234' })
      .expect(201);

    accessToken = loginResponse.body.access_token;
  });

  it('/operations/deposit (POST) - should be authorized', () => {
    return request(app.getHttpServer())
      .post('/operations/deposit')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        amount: 20.5,
        account: '00001',
      })
      .expect(201);
  });

  it('/operations/withdraw (POST) - should be authorized', () => {
    return request(app.getHttpServer())
      .post('/operations/withdraw')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        amount: 0.5,
        account: '00001',
      })
      .expect(201);
  });

  it('/operations/transfer (POST) - should be authorized', () => {
    return request(app.getHttpServer())
      .post('/operations/transfer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        amount: 10.25,
        fromAccount: '0001',
        toAccount: '0002',
      })
      .expect(201);
  });

  it('/operations/deposit (POST) - should be bad request 400', () => {
    return request(app.getHttpServer())
      .post('/operations/deposit')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        account: '00001',
      })
      .expect(400);
  });

  it('/operations/withdraw (POST) - should be bad request 400', () => {
    return request(app.getHttpServer())
      .post('/operations/withdraw')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        account: '00001',
      })
      .expect(400);
  });

  it('/operations/transfer (POST) - should be bad request 400', () => {
    return request(app.getHttpServer())
      .post('/operations/transfer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        toAccount: '0002',
      })
      .expect(400);
  });

  it('/operations/deposit (POST) - should be unauthorized', () => {
    return request(app.getHttpServer())
      .post('/operations/deposit')
      .send({
        amount: 20.5,
        account: '00001',
      })
      .expect(401);
  });

  it('/operations/withdraw (POST) - should be unauthorized', () => {
    return request(app.getHttpServer())
      .post('/operations/withdraw')
      .send({
        amount: 0.5,
        account: '00001',
      })
      .expect(401);
  });

  it('/operations/transfer (POST) - should be unauthorized', () => {
    return request(app.getHttpServer())
      .post('/operations/transfer')
      .send({
        amount: 10.25,
        fromAccount: '0001',
        toAccount: '0002',
      })
      .expect(401);
  });

  it('/operations/deposit (POST) - should trigger throttle', async () => {
    const data = {
      amount: 0.5,
      account: '00001',
    };

    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/operations/deposit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .expect(201);
    }

    await request(app.getHttpServer())
      .post('/operations/deposit')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .expect(429)
      .expect((respone) => {
        expect(respone.body.statusCode).toEqual(429);
        expect(respone.body.message).toEqual(
          'Your request has been blocked due to potential fraudulent activity. Please contact support if you believe this is an error.',
        );
      });
  });

  it('/operations/withdraw (POST) - should trigger throttle', async () => {
    const data = {
      amount: 0.5,
      account: '00001',
    };

    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/operations/withdraw')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .expect(201);
    }

    await request(app.getHttpServer())
      .post('/operations/withdraw')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .expect(429)
      .expect((respone) => {
        expect(respone.body.statusCode).toEqual(429);
        expect(respone.body.message).toEqual(
          'Your request has been blocked due to potential fraudulent activity. Please contact support if you believe this is an error.',
        );
      });
  });

  it('/operations/transfer (POST) - should trigger throttle', async () => {
    const data = {
      amount: 1.25,
      fromAccount: '0001',
      toAccount: '0002',
    };

    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/operations/transfer')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data)
        .expect(201);
    }

    await request(app.getHttpServer())
      .post('/operations/transfer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data)
      .expect(429)
      .expect((respone) => {
        expect(respone.body.statusCode).toEqual(429);
        expect(respone.body.message).toEqual(
          'Your request has been blocked due to potential fraudulent activity. Please contact support if you believe this is an error.',
        );
      });
  });
});
