import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import multer, { diskStorage } from 'multer';
import formidable from 'formidable';
import { AuthDTO } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserDTO } from '../dto/index';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async h(dto: AuthDTO): Promise<any> {
    console.log('Hello');
  }

  async uploadFiles(files: any, dto: UserDTO) {
    // const form = formidable({});
    // console.log(formidable);
    console.log(files, dto.walletAddress);
  }
}
