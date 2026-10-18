import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetNearbyPlacesDto {
  @ApiProperty({ description: 'Vĩ độ GPS của người dùng', example: 21.028511 })
  @IsNotEmpty({ message: 'Vĩ độ (lat) là bắt buộc' })
  @Type(() => Number)
  @IsNumber({}, { message: 'lat phải là một số' })
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ description: 'Kinh độ GPS của người dùng', example: 105.854444 })
  @IsNotEmpty({ message: 'Kinh độ (lng) là bắt buộc' })
  @Type(() => Number)
  @IsNumber({}, { message: 'lng phải là một số' })
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({ description: 'Tên món ăn cần tìm quán xung quanh', example: 'Bún chả' })
  @IsNotEmpty({ message: 'Tên món ăn (foodName) là bắt buộc' })
  @IsString()
  foodName: string;

  @ApiPropertyOptional({ description: 'Bán kính tìm kiếm (mét)', default: 3000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(500)
  @Max(20000)
  radius?: number = 3000;
}
