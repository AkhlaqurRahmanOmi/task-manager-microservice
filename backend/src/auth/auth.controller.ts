import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async register(@Body() createUserDto: CreateUserDto, @Res() res) {
    const { accessToken } = await this.authService.register(createUserDto);
    res.json({ accessToken });
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const { accessToken } = await this.authService.login(loginDto);
    res.json({ accessToken });
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res) {
    const { accessToken } = await this.authService.refreshTokens(
      refreshTokenDto.refreshToken,
    );
    res.json({ accessToken });
  }

  @Post('validate-user')
  @ApiOperation({ summary: 'Validate user credentials' })
  @ApiResponse({ status: 200, description: 'User validated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async validateUser(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    res.json(user);
  }
}
