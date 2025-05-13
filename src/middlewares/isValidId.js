import { BadRequest } from '../utils/errors.js';
import mongoose from 'mongoose';

const isValidId = (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    next(new BadRequest('Invalid user id'));
    return;
  }
  next();
};

export default isValidId;
