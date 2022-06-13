/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class CreationResponse extends HttpException {
  constructor(payload: any) {
    super(payload, HttpStatus.CREATED);
  }
}

export class FoundResponse extends HttpException {
  constructor(payload: any) {
    super(payload, HttpStatus.FOUND);
  }
}

export class UpdateResponse extends HttpException {
  constructor(payload: any) {
    super(payload, HttpStatus.ACCEPTED);
  }
}
