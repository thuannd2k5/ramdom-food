import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FoodsService } from './foods.service';
import { GetRandomFoodDto } from './dto/get-random-food.dto';
import { GetFoodsFilterDto } from './dto/get-foods-filter.dto';

@ApiTags('Foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get('random')
  @ApiOperation({
    summary: 'Quay chọn 1 món ăn ngẫu nhiên theo bộ lọc (Core Randomizer)',
    description:
      'Lựa chọn ngẫu nhiên 1 món ăn dựa trên bữa ăn (sáng/trưa/tối), mức giá tối đa, tag đặc tính và ID danh mục.',
  })
  @ApiResponse({ status: 200, description: 'Trả về món ăn may mắn' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy món ăn phù hợp với bộ lọc' })
  async getRandomFood(@Query() dto: GetRandomFoodDto) {
    return this.foodsService.getRandomFood(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả món ăn (có phân trang & tìm kiếm)',
  })
  @ApiResponse({ status: 200, description: 'Danh sách món ăn và phân trang' })
  async getAllFoods(@Query() dto: GetFoodsFilterDto) {
    return this.foodsService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết món ăn theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết món ăn' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy món ăn' })
  async getFoodById(@Param('id') id: string) {
    return this.foodsService.findById(id);
  }
}
