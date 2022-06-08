/* eslint-disable prettier/prettier */
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: any,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|pdf|csv|doc|docx)$/)) {
    req.fileValidationError =
      'Only image, pdf, csv, doc/docx files are allowed!';
    return callback(null, false);
  }

  callback(null, true);
};

export const filesFilter = (
  req: any,
  res: any,
  files: Express.Multer.File[],
  callback: any,
) => {
  files.map((file: Express.Multer.File) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|pdf|csv|doc|docx)$/)) {
      req.fileValidationError =
        'Only image, pdf, csv, doc/docx files are allowed!';

      return callback(null, false);
    }

    callback(null, true);
  });
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  callback(null, `${name}${fileExtName}`);
};

export const storage = (req, file, callback) => {
  const storagePath = `${process.env.FILES_DESTINATION}/users/${req.query.walletAddress}/`;
  if (!existsSync(storagePath)) {
    mkdirSync(storagePath, { recursive: true });
  }
  callback(null, storagePath);
};
