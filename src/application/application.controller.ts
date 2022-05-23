import {
  Body,
  Controller,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AuthDTO, UserDTO } from 'src/dto';
import { ApplicationService } from './application.service';
import { ValidationPipe } from '../validator/validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { storage } from 'src/common/filters/file.filter';

@Controller('api')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  // @Post('upload')
  // async h(@Body(new ValidationPipe()) authDTO: AuthDTO) {
  //   return this.appService.h(authDTO);
  // }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file1', maxCount: 1 },
        { name: 'file2', maxCount: 2 },
      ],
      {
        dest: './uploads',
      },
    ),
  )
  uploadMultipleFiles(
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
    },
  ) {
    console.log(files);
  }

  @Post('upload1')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: storage,
      }),
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Query() dto: UserDTO,
  ) {
    return this.appService.uploadFiles(files, dto);
  }
}
