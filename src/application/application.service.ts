import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';
import {
  AuthDTO,
  UserDTO,
  LoanRequestDTO,
  LoanUpdateDTO,
  UploadCidDTO,
} from 'src/dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Loans, User } from '.prisma/client';
import { UploadUrlDTO } from '../dto/index';
import {
  ProjectNotFoundException,
  CreationException,
  UserExistsException,
  LoanExistsException,
} from '../helpers/exceptions/exception';
import {
  CreationResponse,
  FoundResponse,
  UpdateResponse,
} from 'src/helpers/successResponse.handler';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getUser(walletAddr: UserDTO): Promise<object> {
    const borrower_walletAddress = walletAddr.walletAddress;
    const user = await this.prisma.user.findUnique({
      where: {
        borrower_walletAddress,
      },
    });

    return new FoundResponse(user);
  }

  async getAllUserLoans(walletAddr: UserDTO): Promise<object> {
    const userLoans = await this.prisma.user.findUnique({
      where: {
        borrower_walletAddress: walletAddr.walletAddress,
      },
      include: { Loans: true },
    });

    return new FoundResponse(userLoans.Loans);
  }

  async getAllUsers(): Promise<object> {
    const result = await this.prisma.user.findMany();
    return new FoundResponse(result);
  }

  async getAllLoans(): Promise<object> {
    const allLoans = await this.prisma.user.findMany({
      include: { Loans: true },
    });

    return new FoundResponse(allLoans);
  }

  async getProjectUrl(walletAddr: UserDTO): Promise<any> {
    const userProjectUrl = await this.prisma.user.findUnique({
      where: {
        borrower_walletAddress: walletAddr.walletAddress,
      },
    });

    return new FoundResponse(userProjectUrl.projectUrl);
  }

  /**
   * @param updateCidDto: wallet address and project cid
   * @yields: save cid and set status to false on database
   * */
  async uploadCid(dto: UploadCidDTO): Promise<any> {
    const cid = dto.cid;

    await this.prisma.user.update({
      where: {
        borrower_walletAddress: dto.walletAddress,
      },
      data: {
        cid,
      },
    });
    // console.log('cid', dto.cid);

    return new UpdateResponse({
      Success: `CID '${cid}' saved for ${dto.walletAddress}`,
    });
  }

  async uploadProjectUrl(dto: UploadUrlDTO): Promise<object> {
    await this.prisma.user.update({
      where: {
        borrower_walletAddress: dto.walletAddress,
      },
      data: {
        projectUrl: dto.project_url,
      },
    });

    return new CreationResponse(`Project url updated for ${dto.walletAddress}`);
  }

  async retrieveUserFiles(dto: UserDTO) {
    const borrower_walletAddress = dto.walletAddress.toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        borrower_walletAddress,
      },
    });

    return await this.retrieveFiles(user.cid, dto.walletAddress);
  }

  /**
   *
   * @returns file links for all project devlopers with their wallet addresses as a point of reference
   * */
  async fetchProjects(): Promise<any> {
    const load = await this.fetchAllCIDsAndWallets();
    let d;
    const data = [];
    // let data_array = [];
    for (const dt in load) {
      d = load[dt].map((item) => {
        return item;
      });
    }
    for (const i in d) {
      data.push(await this.retrieveFiles(d[i].cid, d[i].walletAddress));
    }

    return data;
  }

  async registerUser(dto: AuthDTO): Promise<any> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        borrower_walletAddress: dto.walletAddress,
      },
    });

    if (userExists) return new UserExistsException(dto.walletAddress);

    const walletAddress = dto.walletAddress.toLowerCase();

    const hash = await this.generateHash(walletAddress).then((hash) => hash);

    try {
      await this.prisma.user.create({
        data: {
          borrower_name: dto.borrower_name,
          email: dto.email,
          borrower_walletAddress: walletAddress,
          nationality: dto.nationality,
          hash,
        },
      });
    } catch (error) {
      return new CreationException({
        target: error.meta.target,
        code: error.code,
      });
    }

    return new CreationResponse({
      Success: `User created. Wallet Address: ${walletAddress}`,
    });
  }

  // async uploadFiles(files: any, dto: UserDTO) {
  //   // const form = formidable({});
  //   // console.log(formidable);
  //   console.log(files, dto.walletAddress);
  //   // let fileExists;

  //   for (const file in files) {
  //     const fileExists = await this.prisma.files.findUnique({
  //       where: {
  //         file_name: files[file]['originalname'],
  //       },
  //     });

  //     if (fileExists)
  //       return new FileExistsException(files[file]['originalname']);

  //     await this.prisma.user.update({
  //       where: {
  //         borrower_walletAddress: dto.walletAddress,
  //       },
  //       data: {
  //         Files: {
  //           create: [
  //             {
  //               file_name: files[file]['originalname'],
  //             },
  //           ],
  //         },
  //       },
  //     });
  //   }
  // }

  // async getFiles(dto: UserDTO): Promise<StreamableFile> {
  //   const walletAddr = dto.walletAddress.toLocaleLowerCase();

  //   const userFiles = await this.prisma.user.findUnique({
  //     where: {
  //       borrower_walletAddress: walletAddr,
  //     },
  //     include: { Files: true },
  //   });

  //   console.log(userFiles.Files);

  //   const filenames = userFiles.Files;

  //   // for (const filename in filenames) {
  //   //   const file = createReadStream(
  //   //     `uploads/users/${dto.walletAddress}/${filenames[filename]['file_name']}`,
  //   //   );
  //   //   return new StreamableFile(file);
  //   // }
  //   const file = createReadStream(
  //     `uploads/users/${dto.walletAddress}/${filenames[0]['file_name']}`,
  //   );
  //   return new StreamableFile(file);
  // }

  async createLoanRequest(walletAddr: UserDTO, dto: LoanRequestDTO) {
    const borrower_walletAddress: UserDTO['walletAddress'] =
      walletAddr.walletAddress;
    const user: User = await this.prisma.user.findUnique({
      where: {
        borrower_walletAddress,
      },
    });

    const loanExists: Loans = await this.prisma.loans.findUnique({
      where: {
        loan_name: dto.loan_name,
      },
    });

    const hashCheck =
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(borrower_walletAddress),
      ) == user.hash;

    if (!user) return new ProjectNotFoundException(borrower_walletAddress);
    const loanId = uuidv4();

    if (!hashCheck) return new ProjectNotFoundException(borrower_walletAddress);

    if (loanExists) return new LoanExistsException(dto.loan_name);
    await this.prisma.loans.create({
      data: {
        borrower_walletAddress: user.borrower_walletAddress,
        loanId,
        loan_pool_address: dto.loan_pool_address,
        loan_name: dto.loan_name,
        loan_amount: dto.loan_amount,
        loan_status: 'posted',
        tenor: dto.tenor,
        grace_period: dto.grace_period,
        collateral_offered: dto.collateral_offered,
      },
    });

    return new CreationResponse({ Success: 'Loan created' });
  }

  async updateLoanStatus(loanUpdateDTO: LoanUpdateDTO) {
    await this.prisma.loans.update({
      where: {
        loan_pool_address: loanUpdateDTO.loan_pool_address,
      },
      data: {
        loan_status: loanUpdateDTO.status,
      },
    });

    return new UpdateResponse({
      Success: `Loan with address ${loanUpdateDTO.loan_pool_address} has been updated as ${loanUpdateDTO.status}`,
    });
  }

  // ---------------------------------------------Pure functions---------------------------------------------------
  async generateHash(walletAddr: string): Promise<any> {
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(walletAddr));

    return hash;
  }

  /**
   *
   * @returns web3.storage access token
   */
  async getAccessToken(): Promise<string> {
    return this.config.get<string>('web3Storage');
  }

  /**
   *  @returns new Web3Storage instance
   */
  async makeStorageClient() {
    const token = await this.getAccessToken();
    return new Web3Storage({ token });
  }

  /**
   * @param updateCidDto: wallet address and project cid
   * @yields: save cid and set status to false on database
   * */
  async retrieveFiles(cid: string, walletAddress: string) {
    const client = await this.makeStorageClient();
    const res = await client.get(cid);

    const data = new Object();
    const key = walletAddress;
    data[key] = [];

    // unpack File objects from the response
    const files = await res.files();
    for (const file of files) {
      data[key].push(
        JSON.parse(
          JSON.stringify(`https://${cid}.ipfs.dweb.link/${file.name}`),
        ),
      );
    }

    return data;
  }

  /**
   *
   * @returns all user records
   * */
  async fetchAllCIDsAndWallets() {
    const users = await this.prisma.user.findMany({
      where: {
        cid: {
          not: null,
        },
      },
    });

    const data = {};
    const key = 'data';
    data[key] = [];

    for (const user in users) {
      const input = {
        walletAddress: users[user].borrower_walletAddress,
        cid: users[user].cid,
      };
      // console.log(data);
      data[key].push(input);
    }

    return JSON.parse(JSON.stringify(data));
  }
}
