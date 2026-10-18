import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Đăng ký tài khoản người dùng mới bằng Email & Mật khẩu
   */
  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email này đã được đăng ký trong hệ thống.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const newUser = await this.usersService.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      authProvider: 'local',
    });

    const accessToken = this.signToken(newUser._id.toString(), newUser.email);

    return {
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        authProvider: newUser.authProvider,
      },
      accessToken,
    };
  }

  /**
   * Đăng nhập người dùng bằng Email & Mật khẩu
   */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const accessToken = this.signToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        authProvider: user.authProvider,
      },
      accessToken,
    };
  }

  /**
   * Đăng nhập hoặc Tạo tài khoản qua Google OAuth
   */
  async googleAuth(dto: GoogleAuthDto) {
    const email = dto.email || `google_user_${Date.now()}@gmail.com`;
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email,
        fullName: dto.fullName || 'Người dùng Google',
        avatarUrl: dto.avatarUrl,
        authProvider: 'google',
        googleId: dto.idToken.slice(0, 30),
      });
    }

    const accessToken = this.signToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        authProvider: user.authProvider,
      },
      accessToken,
    };
  }

  private signToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
