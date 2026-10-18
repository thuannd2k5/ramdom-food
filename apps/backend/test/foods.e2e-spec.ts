import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('Foods & Categories (e2e)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/categories (GET) - nên trả về danh sách danh mục món ăn', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('/api/v1/foods/random (GET) - nên quay được một món ăn ngẫu nhiên', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/foods/random')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('imageUrl');
    expect(res.body.data).toHaveProperty('priceMin');
  });

  it('/api/v1/foods/random (GET) - lọc theo bữa trưa và giá tối đa', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/foods/random?mealType=lunch&maxPrice=60000')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.mealTypes).toContain('lunch');
    expect(res.body.data.priceMin).toBeLessThanOrEqual(60000);
  });

  it('/api/v1/foods (GET) - lấy danh sách có phân trang', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/foods?page=1&limit=5')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('items');
    expect(res.body.data).toHaveProperty('pagination');
    expect(res.body.data.items.length).toBeLessThanOrEqual(5);
  });
});
