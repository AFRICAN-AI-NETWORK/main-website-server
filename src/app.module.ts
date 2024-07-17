import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { UsersModule } from './modules/users/users.module';
import { UploadModule } from './modules/upload/upload.module';
import { AiToolsModule } from './modules/ai-tools/ai-tools.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { CoursesModule } from './modules/courses/courses.module';
import { CountriesModule } from './modules/countries/countries.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    // External Modules
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_AUTH_TOKEN_SECRET,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        // secure: false,
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"African AI Network" <${process.env.EMAIL_ADDRESS}>`,
      },
    }),

    // Internal Modules
    UsersModule,
    PrismaModule,
    AuthModule,
    RedisModule,
    UploadModule,
    AiToolsModule,
    ResourcesModule,
    CoursesModule,
    CountriesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
