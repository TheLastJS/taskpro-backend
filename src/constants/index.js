import path from 'node:path';

export const TEMPLATES_FOLDER = path.join(process.cwd(), 'src', 'templates');

export const TEMP_FOLDER = path.join(process.cwd(), 'temp');
export const UPLOAD_FOLDER = path.join(process.cwd(), 'uploads');

// JWT token expiration times
export const ACCESS_TOKEN_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN = '7d';
