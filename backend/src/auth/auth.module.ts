import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GenerateTokenProvider } from './generate-token/generate-token';
import { RefreshTokenProvider } from './refresh-token/refresh-token';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule.forRoot({load : [ jwtConfig]}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenProvider,
    GenerateTokenProvider
  ],
  exports: [AuthService],
})
export class AuthModule {}
