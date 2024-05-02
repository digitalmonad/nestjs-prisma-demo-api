import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit' as never, async () => {
      await app.close();
    });
  }
}
