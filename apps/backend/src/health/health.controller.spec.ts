import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { getConnectionToken } from '@nestjs/mongoose';

describe('HealthController', () => {
  let controller: HealthController;
  const mockConnection = {
    readyState: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getConnectionToken(),
          useValue: mockConnection,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status with connected database', () => {
    const result = controller.checkHealth();
    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('database', 'connected');
    expect(result).toHaveProperty('service', 'random-food-backend');
    expect(result).toHaveProperty('uptime');
    expect(result).toHaveProperty('timestamp');
  });

  it('should return disconnected when database readyState is not 1', () => {
    mockConnection.readyState = 0;
    const result = controller.checkHealth();
    expect(result.database).toBe('disconnected');
    mockConnection.readyState = 1;
  });
});
