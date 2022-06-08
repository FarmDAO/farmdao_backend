import {
  Body,
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthDTO, UserDTO } from 'src/dto';
import { ApplicationService } from './application.service';
import { ValidationPipe } from '../validator/validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { storage } from 'src/common/filters/file.filter';
import { fileFilter, editFileName } from '../common/filters/file.filter';

@Controller('api')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post('register')
  async registerUser(@Body(new ValidationPipe()) authDTO: AuthDTO) {
    return this.appService.registerUser(authDTO);
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: storage,
        filename: editFileName,
      }),
      fileFilter: fileFilter,
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Query(new ValidationPipe()) dto: UserDTO,
  ) {
    return this.appService.uploadFiles(files, dto);
  }
}
