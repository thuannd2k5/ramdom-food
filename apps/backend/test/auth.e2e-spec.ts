import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('Authentication & Favorites (e2e)', () => {
  let app: INestApplication;
  const uniqueEmail = `test_user_${Date.now()}@example.com`;
  const password = 'Password123!';
  let jwtToken = '';
  let sampleFoodId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    // Lấy 1 foodId mẫu
    const foodRes = await request(app.getHttpServer()).get('/api/v1/foods/random');
    sampleFoodId = foodRes.body.data._id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/auth/register (POST) - đăng ký tài khoản thành công', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: uniqueEmail,
        password,
        fullName: 'Nguyễn Văn Test',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.user.email).toBe(uniqueEmail);
  });

  it('/api/v1/auth/register (POST) - báo lỗi khi trùng email (409)', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: uniqueEmail,
        password,
        fullName: 'Nguyễn Văn Test',
      })
      .expect(409);
  });

  it('/api/v1/auth/login (POST) - đăng nhập thành công nhận token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: uniqueEmail,
        password,
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    jwtToken = res.body.data.accessToken;
  });

  it('/api/v1/users/me (GET) - không có token thì trả về 401', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .expect(401);
  });

  it('/api/v1/users/me (GET) - có token thì trả về thông tin profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(uniqueEmail);
  });

  it('/api/v1/users/favorites/:foodId (POST) - toggle bookmark món ăn', async () => {
    if (!sampleFoodId) return;

    // Lần 1: Thêm vào yêu thích
    const res1 = await request(app.getHttpServer())
      .post(`/api/v1/users/favorites/${sampleFoodId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res1.body.data.isFavorited).toBe(true);

    // Kiểm tra danh sách yêu thích
    const listRes = await request(app.getHttpServer())
      .get('/api/v1/users/favorites')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(listRes.body.success).toBe(true);
    expect(listRes.body.data.length).toBeGreaterThan(0);

    // Lần 2: Bỏ khỏi yêu thích
    const res2 = await request(app.getHttpServer())
      .post(`/api/v1/users/favorites/${sampleFoodId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res2.body.data.isFavorited).toBe(false);
  });
});
