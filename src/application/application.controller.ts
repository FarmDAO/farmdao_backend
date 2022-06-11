import * as fs from 'fs';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Response,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { join } from 'path';
import {
  AuthDTO,
  UserDTO,
  LoanRequestDTO,
  LoanUpdateDTO,
  UploadCidDTO,
} from 'src/dto';
import { ApplicationService } from './application.service';
import { ValidationPipe } from '../validator/validation.pipe';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { storage } from 'src/common/filters/file.filter';
// import { fileFilter, editFileName } from '../common/filters/file.filter';
// import { createReadStream } from 'fs';
// import { CreationResponse } from '../helpers/successResponse.handler';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('FarmDAO')
@Controller('api')
export class ApplicationController {
  constructor(
    private prisma: PrismaService,
    private readonly appService: ApplicationService,
  ) {}

  @ApiOperation({ summary: "Get a user's details" })
  @ApiResponse({
    status: 200,
    description:
      'id, borrower name, borrower email, kyc status, borrower wallet address, nationality, hash, projectUrl, {status, message, name}',
  })
  @Get('user')
  async getUser(@Query(new ValidationPipe()) walletAddr: UserDTO) {
    return this.appService.getUser(walletAddr);
  }

  @ApiOperation({ summary: "Get a user's Loans" })
  @ApiResponse({
    status: 200,
    description:
      'id, loanId, loan_name, loan_pool_address, borrower_walletAddress, loan_amount, loan_status, tenor, collateral_offered, grace_period, createdAt, {status, message, name}',
  })
  @Get('all-user-loans')
  async getAllUserLoans(@Query(new ValidationPipe()) walletAddr: UserDTO) {
    return this.appService.getAllUserLoans(walletAddr);
  }

  @ApiOperation({ summary: "Get all users' details" })
  @ApiResponse({
    status: 200,
    description:
      'id, borrower name, borrower email, kyc status, borrower wallet address, nationality, hash, projectUrl, {status, message, name}',
  })
  @Get('all-users')
  async getAllUsers() {
    return this.appService.getAllUsers();
  }

  @ApiOperation({ summary: "Get borrower's files" })
  @ApiProperty({
    example: '0x0000000000000',
    description: "borrower's wallet addresses",
  })
  @ApiResponse({
    status: 200,
    description: "returns borrower's files' urls",
  })
  @Get('retrieve-files')
  async retrieveUserFiles(@Query(new ValidationPipe()) dto: UserDTO) {
    return this.appService.retrieveUserFiles(dto);
  }

  @ApiOperation({ summary: "Get all borrowers' files" })
  @ApiResponse({
    status: 200,
    description: "returns borrower's files' urls",
  })
  @Get('retrieve-all-files')
  async retrieveAllUsersFiles() {
    return this.appService.fetchProjects();
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description:
      'response: {success: "User created. Wallet Address: 0x000000000000000000000000"}, {status, message, name}',
  })
  @Post('register-user')
  async registerUser(@Body(new ValidationPipe()) authDTO: AuthDTO) {
    return this.appService.registerUser(authDTO);
  }

  @ApiOperation({ summary: 'Store borrower files CID' })
  @ApiProperty({
    example: 'bk2b12-2lne2323-1l2kn',
    description: 'CID returned from web3.storage after documents upload',
  })
  @ApiResponse({
    status: 200,
    description: 'CID stored',
  })
  @Post('upload-cid')
  async uploadCid(@Body(new ValidationPipe()) dto: UploadCidDTO) {
    return this.appService.uploadCid(dto);
  }

  // @ApiOperation({ summary: 'Upload borrower files' })
  // @ApiProperty({
  //   examples: ['file1', 'file2', 'file3'],
  //   description: 'Borrower documents for kyc',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'files uploaded',
  // })
  // @Post('upload-files')
  // @UseInterceptors(
  //   FilesInterceptor('file', 10, {
  //     storage: diskStorage({
  //       destination: storage,
  //       filename: editFileName,
  //     }),
  //     fileFilter: fileFilter,
  //   }),
  // )
  // async uploadFiles(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Query(new ValidationPipe()) dto: UserDTO,
  // ) {
  //   return this.appService.uploadFiles(files, dto);
  // }

  // @Get('retrieve-files')
  // async getFiles(
  //   @Response({ passthrough: true }) res,
  //   @Query(new ValidationPipe()) dto: UserDTO,
  // ) {
  //   const walletAddr = dto.walletAddress.toLocaleLowerCase();

  //   const userFiles = await this.prisma.user.findUnique({
  //     where: {
  //       borrower_walletAddress: walletAddr,
  //     },
  //     include: { Files: true },
  //   });

  //   console.log(userFiles.Files);

  //   const filenames = userFiles.Files;

  //   for (const filename in filenames) {
  //     const file = await createReadStream(
  //       join(
  //         process.cwd(),
  //         `uploads/users/${dto.walletAddress}/${filenames[filename]['file_name']}`,
  //       ),
  //     );
  //     res.set({
  //       'Content-Type': 'text',
  //       'Content-Disposition': 'attachment; filename="package.json"',
  //     });
  //     return new StreamableFile(await file);
  //   }
  // const file = createReadStream(
  //   join(process.cwd()),
  //   `uploads/users/${dto.walletAddress}/*`,
  // );
  // console.log(file);
  // const filesReceived: any[] = [];
  // const stream: any[] = [1];
  // await fs.readdir(`uploads/users/${dto.walletAddress}/`, (err, files) => {
  //   const filesHolder: any[] = [];
  //   files.forEach((file) => {
  //     filesReceived.push(file);
  //   });
  //   filesReceived.push(1);
  // });
  // console.log(await filesReceived);
  // stream.push(filesReceiver);
  // return filesReceiver;
  // console.log(filesHolder);
  // });
  // console.log(filesReceived);
  // console.log(file);
  // const data = {};
  // function readFiles(dirname, onFileContent, onError) {
  //   fs.readdir(dirname, function (err, filenames) {
  //     if (err) {
  //       onError(err);
  //       return;
  //     }
  //     filenames.forEach((filename) => {
  //       fs.readFile(dirname + filename, 'utf-8', (err, content) => {
  //         if (err) {
  //           onError(err);
  //           return;
  //         }
  //         onFileContent(filename, content);
  //       });
  //     });
  //   });
  // }
  // readFiles(
  //   `uploads/users/${dto.walletAddress}/`,
  //   (filename, content) => {
  //     data[filename] = content;
  //   },
  //   (err) => {
  //     throw err;
  //   },
  // );
  // const readFiles = (dirname) => {
  //   const readDirPr = new Promise((resolve, reject) => {
  //     fs.readdir(dirname, (err, filenames) =>
  //       err ? reject(err) : resolve(filenames),
  //     );
  //   });
  //   return readDirPr.then((filenames: any) =>
  //     Promise.all(
  //       filenames.map((filename) => {
  //         return new StreamableFile(createReadStream(dirname + filename));
  //       }),
  //     ).catch((error) => Promise.reject(error)),
  //   );
  // };
  // const hold = readFiles(`uploads/users/${dto.walletAddress}/`).then(
  //   (allContents) => {
  //     // handle success treatment
  //     return allContents;
  //   },
  //   (error) => console.log(error),
  // );
  // return new CreationResponse(hold);
  // }

  // @Get('get-file')
  // getFile(@Response({ passthrough: true }) res, @Query() dto: UserDTO) {
  //   // const file = createReadStream(join(process.cwd(), '1.docx'));
  //   // res.set({
  //   //   'Content-Type': 'docs',
  //   //   'Content-Disposition': 'attachment; filename="1.docx"',
  //   // });
  //   // res.vary('User-Agent').render('docs');
  //   // return new StreamableFile(file);
  //   const docPath = join(
  //     __dirname,
  //     `uploads/users/${dto.walletAddress}/1.docx`,
  //   );
  //   res.download(docPath, '1.docx', function (err) {
  //     if (err) {
  //       // if the file download fails, we throw an error
  //       throw err;
  //     }
  //   });
  // }

  @ApiOperation({ summary: 'Create a loan' })
  @ApiResponse({
    status: 201,
    description:
      'response: { success: "Loan Created"}, {status, message, name}',
  })
  @Post('create-loan-request')
  async createLoanRequest(
    @Query(new ValidationPipe()) walletAddr: UserDTO,
    @Body(new ValidationPipe()) loanRequestDTO: LoanRequestDTO,
  ) {
    return this.appService.createLoanRequest(walletAddr, loanRequestDTO);
  }

  @ApiOperation({ summary: "Update a Loan's status" })
  @ApiResponse({
    status: 202,
    description:
      'response: { success: "Loan with address 0x0000 has been updated as approved"}, {status, message, name}',
  })
  @ApiQuery({
    name: 'status',
    enum: [
      'approved',
      'funding',
      'funded',
      'repaying',
      'repaid',
      'delinquent',
      'default',
    ],
  })
  @Patch('update-loan-status')
  async updateLoanStatus(@Body(new ValidationPipe()) dto: LoanUpdateDTO) {
    return this.appService.updateLoanStatus(dto);
  }
}
