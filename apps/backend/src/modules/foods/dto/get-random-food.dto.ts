import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRandomFoodDto {
  @ApiPropertyOptional({
    description: 'Bữa ăn',
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    example: 'lunch',
  })
  @IsOptional()
  @IsIn(['breakfast', 'lunch', 'dinner', 'snack'], {
    message: 'Bữa ăn phải thuộc một trong các giá trị: breakfast, lunch, dinner, snack',
  })
  mealType?: string;

  @ApiPropertyOptional({
    description: 'Mức giá tối đa mong muốn (VND)',
    example: 50000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice phải là một số hợp lệ' })
  @Min(10000, { message: 'maxPrice tối thiểu là 10.000 VND' })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Nhãn đặc tính món (spicy, non_spicy, soup, dry, office_favorite, cheap)',
    example: 'office_favorite',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'ID danh mục món ăn',
    example: '67123abc...',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Danh sách ID món ăn cần loại trừ (ngăn trùng lặp liên tiếp, phân cách bởi dấu phẩy)',
    example: '67123def,67123ghi',
  })
  @IsOptional()
  @IsString()
  excludeIds?: string;
}
