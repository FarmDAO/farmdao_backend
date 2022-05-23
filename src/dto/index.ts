/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEthereumAddress,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  borrower_name: string;

  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsNotEmpty()
  @IsObject()
  data: any;
}

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  walletAddress: string;
}
