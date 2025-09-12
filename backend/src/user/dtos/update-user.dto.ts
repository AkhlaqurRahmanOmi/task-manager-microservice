import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'The password of the user (min 6 characters)' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
