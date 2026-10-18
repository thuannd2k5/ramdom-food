import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { GetNearbyPlacesDto } from './dto/get-nearby-places.dto';

@ApiTags('Places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('nearby')
  @ApiOperation({
    summary: 'Tìm quán ăn bán món này xung quanh vị trí GPS',
    description:
      'Nhận tọa độ latitude, longitude của người dùng và tên món ăn, tính khoảng cách mét và trả về danh sách quán gần nhất kèm link chỉ đường Google Maps.',
  })
  @ApiResponse({ status: 200, description: 'Danh sách quán ăn xung quanh' })
  async getNearbyPlaces(@Query() dto: GetNearbyPlacesDto) {
    return this.placesService.getNearbyPlaces(dto);
  }
}
