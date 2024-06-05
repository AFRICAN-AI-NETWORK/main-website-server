import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'User email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'User password',
    format:
      'At least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 symbol',
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    format: 'At least 2 characters',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'User email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'User password',
    format:
      'At least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 symbol',
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({
    example: Role.USER,
    description: 'The role the user is signing up for',
    enum: Role,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn([Role.USER, Role.ADMIN])
  role: Role;
}
