import { TEMP_FOLDER, UPLOAD_FOLDER } from './constants/index.js';
import { initMongoDB } from './db/initMongoConnection.js';

import { startServer } from './server.js';
import { createFileIfNotExist } from './utils/createFileIfNotExist.js';

const bootstrap = async () => {
  try {
    await initMongoDB();
    await createFileIfNotExist(TEMP_FOLDER);
    await createFileIfNotExist(UPLOAD_FOLDER);
    startServer();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

bootstrap();
