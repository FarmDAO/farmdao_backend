/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  borrower_name: string;

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
