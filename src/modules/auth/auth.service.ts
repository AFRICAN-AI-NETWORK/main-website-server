import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'src/lib/bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../users/users.entity';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthResponseEntity, AuthTokensEntity } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async getProfile(userId: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        authoredAiTools: true,
        authoredAiToolCategories: true,
        authoredResources: true,
        authoredResourceCategories: true,
      },
    });

    return new UserEntity(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new BadRequestException('Invalid email');

    if (!(await compare(dto.password, user.password)))
      throw new BadRequestException('Invalid email or password');

    return {
      user: new UserEntity(user),
      ...(await this.generateAuthTokens(user.id)),
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponseEntity> {
    let user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (user)
      throw new BadRequestException('An account already exists for this email');

    dto.password = await hash(dto.password);
    user = await this.prismaService.user.create({
      data: {
        ...dto,
      },
    });

    const verificationLink = await this.generateEmailVerificationLink(user.id);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email address',
      text: `Please click the following link to verify your email address: ${verificationLink}`,
      html: `<p>Please click the following link to verify your email address:</p><a href="${verificationLink}">${verificationLink}</a>`,
    });

    return {
      user: new UserEntity(user),
      ...(await this.generateAuthTokens(user.id)),
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });
      if (!user) throw new UnauthorizedException('Invalid verification token');

      await this.prismaService.user.update({
        where: { id: payload.id },
        data: { emailVerified: true },
      });

      return {
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid verification token');
    }
  }

  async refreshToken(token: string): Promise<AuthTokensEntity> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      });
      return this.generateAuthTokens(payload.id);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateEmailVerificationLink(id: string): Promise<string> {
    return `${this.configService.getOrThrow('EMAIL_VERIFICATION_URL')}?token=${await this.generateVerificationToken(id)}`;
  }

  private async generateAuthTokens(id: string): Promise<AuthTokensEntity> {
    return {
      accessToken: await this.jwtService.signAsync(
        { id },
        {
          expiresIn: this.configService.getOrThrow(
            'JWT_AUTH_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        { id },
        {
          secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
    };
  }

  private async generateVerificationToken(id: string): Promise<string> {
    return this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: this.configService.getOrThrow(
          'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
        ),
      },
    );
  }
}
