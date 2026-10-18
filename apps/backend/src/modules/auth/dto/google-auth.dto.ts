import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ description: 'ID Token từ Google OAuth SDK', example: 'eyJhbGciOiJSUzI1Ni...' })
  @IsNotEmpty({ message: 'idToken không được để trống' })
  @IsString()
  idToken: string;

  @ApiPropertyOptional({ description: 'Email từ Google Profile', example: 'user@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Họ tên từ Google Profile', example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Avatar URL từ Google Profile' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
