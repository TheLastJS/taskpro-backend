import Joi from 'joi';

export const addColumnSchema = Joi.object({
  title: Joi.string().min(1).required(),
});
