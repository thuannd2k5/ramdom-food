import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục món ăn' })
  @ApiResponse({ status: 200, description: 'Danh sách danh mục' })
  async getCategories() {
    return this.categoriesService.findAll();
  }
}
