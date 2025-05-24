import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessions.js';
import { userCollection } from '../db/models/user.js';

export const authorize = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(createHttpError(401, 'Authorization header is missing'));
    return;
  }

  const bearer = authorization.split(' ')[0];
  const token = authorization.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Invalid token format'));
    return;
  }

  const session = await SessionsCollection.findOne({
    accessToken: token,
  });

  if (!session) {
    next(createHttpError(401, 'Invalid token'));
    return;
  }

  if (session.accessTokenValidUntil < new Date()) {
    next(createHttpError(401, 'Token expired'));
    return;
  }

  const user = await userCollection.findById(session.userId);

  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }
  req.user = user;
  next();
};
