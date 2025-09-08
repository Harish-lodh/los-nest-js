// src/leads/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

export const uploadsStorage = diskStorage({
  destination: (_req, _file, cb) => cb(null, './uploads/leads'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});
