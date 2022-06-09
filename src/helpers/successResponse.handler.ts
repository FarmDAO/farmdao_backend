/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class CreationResponse extends HttpException {
  constructor(payload: object) {
    super(payload, HttpStatus.CREATED);
  }
}

export class FoundResponse extends HttpException {
  constructor(payload: object) {
    super(payload, HttpStatus.FOUND);
  }
}
