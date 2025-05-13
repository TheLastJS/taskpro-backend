import jwt from 'jsonwebtoken';
import { sessionCollection } from '../db/models/session.js';
import { HttpError } from '../utils/errors.js';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new HttpError(401, 'Not authorized');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const session = await sessionCollection.findOne({
      userId: decoded.id,
      accessToken: token,
      accessTokenValidUntil: { $gt: new Date() },
    });

    if (!session) {
      throw new HttpError(401, 'Access token expired');
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
