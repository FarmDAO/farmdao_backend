/* eslint-disable prettier/prettier */
import {
  Allow,
  IsEmail,
  IsEthereumAddress,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  borrower_name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;
}

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;
}

export class ProjectIdDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  project_id: string;
}

export class LoanRequestDTO {
  @IsNotEmpty()
  @IsString()
  loan_name: string;

  @IsNotEmpty()
  @IsString()
  loan_pool_address: string;

  @IsNotEmpty()
  @IsInt()
  loan_amount: number;

  @IsNotEmpty()
  @IsInt()
  tenor: number;

  @IsNotEmpty()
  @IsInt()
  grace_period: number;

  @IsNotEmpty()
  @IsString()
  collateral_offered: string;
}

export class LoanUpdateDTO {
  @IsString()
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

  @IsString()
  @IsNotEmpty()
  loan_pool_address: string;

  @IsString()
  @IsNotEmpty()
  borrower_walletAddress: string;
}
