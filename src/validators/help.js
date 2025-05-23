import Joi from 'joi';

export const needHelpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is a required field.',
  }),
  message: Joi.string().min(10).max(1000).required().messages({
    'string.min': 'Message must be at least 10 characters long.',
    'string.max': 'Message cannot be longer than 1000 characters.',
    'any.required': 'Message is a required field.',
  }),
});
