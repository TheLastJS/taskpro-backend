import fs from 'fs/promises';
import path from 'path';
import { TEMP_FOLDER, UPLOAD_FOLDER } from '../constants/index.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_FOLDER, file.filename),
    path.join(UPLOAD_FOLDER, file.filename),
  );

  return `${process.env.APP_DOMAIN}/uploads/${file.filename}`;
};
