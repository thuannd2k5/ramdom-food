import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({ summary: 'Kiểm tra trạng thái máy chủ và kết nối cơ sở dữ liệu' })
  @ApiResponse({ status: 200, description: 'Máy chủ hoạt động bình thường' })
  checkHealth() {
    const isDbConnected = this.connection.readyState === 1;
    return {
      status: 'ok',
      service: 'random-food-backend',
      database: isDbConnected ? 'connected' : 'disconnected',
      databaseReadyState: this.connection.readyState,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
