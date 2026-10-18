import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGODB_URI',
          'mongodb+srv://nguyenducthuan:nguyenducthuan@cluster0.vgppgun.mongodb.net/ramdom_food',
        ),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
})
export class AppModule {}
