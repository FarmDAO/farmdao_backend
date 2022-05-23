import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { AuthDTO } from 'src/dto';
import { UserDTO } from '../dto/index';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async registerUser(dto: AuthDTO): Promise<any> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        walletAddress: dto.walletAddress,
      },
    });

    if (userExists) return 'User already exists';

    const hash = await this.generateNonce(dto.walletAddress).then(
      (hash) => hash.hash,
    );
    const walletAddress = dto.walletAddress.toLowerCase();
    const projectId = uuidv4();
    await this.prisma.user.create({
      data: {
        borrower_name: dto.borrower_name,
        email: dto.email,
        walletAddress,
        nationality: dto.nationality,
        projectId,
        hash,
      },
    });

    return { Success: `User created with id: ${projectId}` };
  }

  async uploadFiles(files: any, dto: UserDTO) {
    // const form = formidable({});
    // console.log(formidable);
    console.log(files, dto.walletAddress);
  }

  // ---------------------------------------------Pure functions---------------------------------------------------
  async generateNonce(walletAddress: string): Promise<any> {
    const nonce = ethers.utils.hexlify(new Date().getTime());
    const walletAddr = walletAddress;
    const hash = ethers.utils.solidityKeccak256(
      ['string', 'string'],
      [nonce, walletAddr],
    );

    return {
      hash,
    };
  }
}
