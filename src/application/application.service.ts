import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { AuthDTO, UserDTO, LoanRequestDTO, LoanUpdateDTO } from 'src/dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Loans, User } from '.prisma/client';
import {
  ProjectNotFoundException,
  CreationException,
  UserExistsException,
  LoanExistsException,
} from '../helpers/exceptions/exception';
import {
  CreationResponse,
  FoundResponse,
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

  async uploadFiles(files: any, dto: UserDTO) {
    // const form = formidable({});
    // console.log(formidable);
    console.log(files, dto.walletAddress);
  }

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
      ethers.utils.keccak256(borrower_walletAddress) == user.hash;

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
    const Loan = await this.prisma.loans.findUnique({
      where: {
        loan_pool_address: loanUpdateDTO.loan_pool_address,
        borrower_walletAddress: loanUpdateDTO.borrower_walletAddress,
      },
    });

    console.log(Loan);
  }

  // ---------------------------------------------Pure functions---------------------------------------------------
  async generateHash(walletAddr: string): Promise<any> {
    const hash = ethers.utils.keccak256(walletAddr);

    return hash;
  }
}
