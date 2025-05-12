import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6).max(15).required(),
  email: Joi.string().email().required(),
  avatar: Joi.string().uri().optional(),
  theme: Joi.string().valid('light', 'dark', 'violet').optional(),
});
