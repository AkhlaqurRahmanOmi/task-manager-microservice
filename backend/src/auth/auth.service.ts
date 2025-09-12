import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '../../common/exceptions/http.exception';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { RefreshTokenProvider } from './refresh-token/refresh-token';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: any): Promise<{ accessToken: string }> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h',
    });
    return { accessToken };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.create(createUserDto);
    // console.log("Registered user:", user);
    return this.login(user);
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string }> {
    const decoded = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
    const user = await this.userService.findOne(decoded.sub);
    return this.login(user);
  }

  
}
