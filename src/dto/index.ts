/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEthereumAddress,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty({
    example: 'Hash Cats Inc',
    description: 'Borrower name',
  })
  @IsNotEmpty()
  @IsString()
  borrower_name: string;

  @ApiProperty({
    example: 'hello@email.come',
    description: 'Borrower email address',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: '0x00000000000000000',
    description: 'Borrower wallet address',
  })
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;

  @ApiProperty({
    example: 'China',
    description: "Borrower's country.",
  })
  @IsNotEmpty()
  @IsString()
  nationality: string;
}

export class UserDTO {
  @ApiProperty({
    example: '0x00000000000000000',
    description: 'Borrower wallet address',
  })
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;
}

export class LoanRequestDTO {
  @ApiProperty({
    example: 'Help cats lone',
    description: 'Loan name picked by borrower',
  })
  @IsNotEmpty()
  @IsString()
  loan_name: string;

  @ApiProperty({
    example: '0x00000000000000000',
    description: 'Loan pool address gotten from smart contract response',
  })
  @IsNotEmpty()
  @IsString()
  loan_pool_address: string;

  @ApiProperty({
    example: 10000000,
    description: 'Amount borrower is requesting for',
  })
  @IsNotEmpty()
  @IsInt()
  loan_amount: number;

  @ApiProperty({
    example: 3,
    description: 'Length of loan (in months)',
  })
  @IsNotEmpty()
  @IsInt()
  tenor: number;

  @ApiProperty({
    example: 12,
    description: 'Delay before payment (in months)',
  })
  @IsNotEmpty()
  @IsInt()
  grace_period: number;

  @ApiProperty({
    example: 'Company building',
    description: 'Collateral offered by borrower',
  })
  @IsNotEmpty()
  @IsString()
  collateral_offered: string;
}

export class LoanUpdateDTO {
  @ApiProperty({
    example: 'accepted',
    description: 'Loan status.',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'approved',
    'funding',
    'funded',
    'repaying',
    'repaid',
    'delinquent',
    'default',
  ])
  status: string;

  @ApiProperty({
    example: '0x00000000000000000',
    description: 'Loan pool address',
  })
  @IsString()
  @IsNotEmpty()
  loan_pool_address: string;
}

export class UploadCidDTO {
  @ApiProperty({
    example: 'bk2b12-2lne2323-1l2kn',
    description: 'CID returned from web3.storage after documents upload',
  })
  @IsString()
  @IsNotEmpty()
  cid: string;

  @ApiProperty({
    example: '0x00000000000000000',
    description: 'Borrower wallet address',
  })
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;
}

export class UploadUrlDTO {
  @ApiProperty({
    example: 'https://url.com',
    description: 'URL to google doc folder holding documents',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  project_url: string;

  @ApiProperty({
    example: '0x00000000000000000',
    description: 'Borrower wallet address',
  })
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;
}
