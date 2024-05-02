import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let prisma: PrismaService;

  const productShape = expect.objectContaining({
    id: expect.any(String),
    description: expect.any(String),
    name: expect.any(String),
    published: expect.any(Boolean),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });

  const productsData = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      published: true,
      price: 999,
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      price: 6666,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await prisma.product.create({ data: productsData[0] });
    await prisma.product.create({ data: productsData[1] });
  });

  describe('GET /products', () => {
    it('returns a list of published products', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/products',
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([productShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(productsData[0].id);
      expect(body[0].published).toBeTruthy();
    });

    it('returns a list of unpublished products', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/products/unpublished',
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([productShape]));
      expect(body).toHaveLength(1);
      expect(body[0].id).toEqual(productsData[1].id);
      expect(body[0].published).toBeFalsy();
    });
  });
});
