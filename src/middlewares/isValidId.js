import { BadRequest } from '../utils/errors.js';
import mongoose from 'mongoose';

const isValidId = (req, res, next) => {
  // Check the first param value (works for userId, boardId, etc)
  const id = Object.values(req.params)[0];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new BadRequest('Invalid id'));
    return;
  }
  next();
};

export default isValidId;
