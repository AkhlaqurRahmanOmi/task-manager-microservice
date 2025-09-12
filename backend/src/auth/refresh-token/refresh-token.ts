import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GenerateTokenProvider } from '../generate-token/generate-token';
import { UserService } from '../../user/user.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly generateTokenProvider: GenerateTokenProvider,
    private readonly userService: UserService,
  ) {}

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
        audience: this.configService.get<string>(
          'JWT_TOKEN_AUDIENCE',
          'nestjs-app',
        ),
        issuer: this.configService.get<string>(
          'JWT_TOKEN_ISSUER',
          'nestjs-auth',
        ),
      });

      const user = await this.userService.findOne(String(sub));
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return await this.generateTokenProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
