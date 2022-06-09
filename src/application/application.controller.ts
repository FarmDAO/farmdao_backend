import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthDTO, UserDTO, LoanRequestDTO, LoanUpdateDTO } from 'src/dto';
import { ApplicationService } from './application.service';
import { ValidationPipe } from '../validator/validation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { storage } from 'src/common/filters/file.filter';
import { fileFilter, editFileName } from '../common/filters/file.filter';
@Controller('api')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Get('user')
  async getUser(@Query(new ValidationPipe()) walletAddr: UserDTO) {
    return this.appService.getUser(walletAddr);
  }

  @Get('all-user-loans')
  async getAllUserLoans(@Query(new ValidationPipe()) walletAddr: UserDTO) {
    return this.appService.getAllUserLoans(walletAddr);
  }

  @Get('all-users')
  async getAllUsers() {
    return this.appService.getAllUsers();
  }

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

  @Post('create-loan-request')
  async createLoanRequest(
    @Query(new ValidationPipe()) walletAddr: UserDTO,
    @Body(new ValidationPipe()) loanRequestDTO: LoanRequestDTO,
  ) {
    return this.appService.createLoanRequest(walletAddr, loanRequestDTO);
  }

  @Patch('update-loan-status')
  async updateLoanStatus(@Body(new ValidationPipe()) dto: LoanUpdateDTO) {
    return this.appService.updateLoanStatus(dto);
  }
}
