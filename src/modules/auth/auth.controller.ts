import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import {
  BadRequestErrorResponseEntity,
  InternalServerErrorResponseEntity,
  ResponseEntity,
} from '../core/core.entity';
import { UserEntity } from '../users/users.entity';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthResponseEntity, AuthTokensEntity } from './auth.entity';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/profile')
  @ApiOperation({ summary: "Get user's profile" })
  @ApiOkResponse({
    description: "User's profile",
    type: UserEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @UseGuards(AuthGuard)
  getProfile(@Req() req: Request) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Log into account' })
  @ApiOkResponse({ description: 'Login successful', type: AuthResponseEntity })
  @ApiBadRequestResponse({
    description: 'Validation failed or Invalid credentials',
    type: BadRequestErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Create new account' })
  @ApiOkResponse({ description: 'Login successful', type: AuthResponseEntity })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('/verify/email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiOkResponse({
    description: 'Email verification successful',
    type: ResponseEntity,
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    type: AuthTokensEntity,
  })
  @ApiBadRequestResponse({
    type: BadRequestErrorResponseEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: InternalServerErrorResponseEntity,
  })
  @HttpCode(HttpStatus.OK)
  refreshToken(@Headers('x-refresh-token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
