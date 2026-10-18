import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFoodsFilterDto {
  @ApiPropertyOptional({ description: 'Số trang', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng món mỗi trang', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm theo tên hoặc mô tả món' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'ID danh mục món ăn' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Bữa ăn', enum: ['breakfast', 'lunch', 'dinner', 'snack'] })
  @IsOptional()
  @IsString()
  mealType?: string;
}
