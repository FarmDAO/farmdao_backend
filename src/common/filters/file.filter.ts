/* eslint-disable prettier/prettier */
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

export const storage = (req, file, callback) => {
  const storagePath = `${process.env.FILES_DESTINATION}/users/${req.query.walletAddress}/`;
  if (!existsSync(storagePath)) {
    mkdirSync(storagePath, { recursive: true });
  }
  callback(null, storagePath);
};
