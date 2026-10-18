import { Controller, Get, Post, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin hồ sơ người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Thông tin cá nhân' })
  async getProfile(@CurrentUser() user: any) {
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    };
  }

  @Post('favorites/:foodId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thêm hoặc bỏ món ăn khỏi danh sách yêu thích (Toggle)' })
  @ApiResponse({ status: 200, description: 'Trạng thái yêu thích mới của món' })
  async toggleFavorite(
    @CurrentUser() user: any,
    @Param('foodId') foodId: string,
  ) {
    return this.usersService.toggleFavorite(user._id, foodId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Lấy danh sách tất cả món ăn yêu thích của người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách các món ăn đã bookmark' })
  async getFavorites(@CurrentUser() user: any) {
    return this.usersService.getFavorites(user._id);
  }
}
