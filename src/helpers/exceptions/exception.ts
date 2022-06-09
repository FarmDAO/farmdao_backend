/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

const errors = {
  P2002: 'provided is already in use',
};

export class CreationException extends HttpException {
  constructor(e: object) {
    super(`${e['target']} ${errors[e['code']]}`, HttpStatus.BAD_REQUEST);
  }
}

export class ProjectNotFoundException extends HttpException {
  constructor(project_id: string) {
    super(`Project with id ${project_id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class UserExistsException extends HttpException {
  constructor(walletAddress: string) {
    super(
      `User with wallet address ${walletAddress} already exists`,
      HttpStatus.FOUND,
    );
  }
}

export class LoanExistsException extends HttpException {
  constructor(loan_name: string) {
    super(
      `A loan with name "${loan_name}" already exists, use a different loan name`,
      HttpStatus.FOUND,
    );
  }
}
