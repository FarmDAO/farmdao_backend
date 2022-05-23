import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AuthenticationController } from './authentication/authentication.controller';
// import { AuthenticationService } from './authentication/authentication.service';
// import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ApplicationModule,
  ],
  // controllers: [AppController, AuthenticationController],
  // providers: [AppService, AuthenticationService, PrismaService],
})
export class AppModule {}
