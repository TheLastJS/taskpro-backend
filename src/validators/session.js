import { header } from 'express-validator';

export const validateSession = [
  header('authorization')
    .exists()
    .withMessage('Authorization header is required')
    .isString()
    .withMessage('Authorization header must be a string')
    .matches(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
    .withMessage('Authorization header must be a valid Bearer token'),
];
