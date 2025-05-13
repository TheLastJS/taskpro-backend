import { BadRequest } from '../utils/errors.js';

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(new BadRequest(error.message));
      return; // Hata varsa burada durmalı
    }
    next();
  };
};

export default validateBody;
