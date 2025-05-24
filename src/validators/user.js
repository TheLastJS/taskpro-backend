import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 3 characters.',
    'string.max': 'Name must be at most 30 characters.',
    'any.required': 'Name is required.',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters.',
    'string.max': 'Password must be at most 100 characters.',
    'any.required': 'Password is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be valid.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  avatar: Joi.any().optional().messages({
    'string.uri': 'Avatar must be a valid URL.',
  }),
  theme: Joi.string()
    .valid('light', 'dark', 'violet')
    .default('light')
    .messages({
      'any.only': 'Theme must be one of light, dark, or violet.',
    }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 3 characters.',
    'string.max': 'Name must be at most 30 characters.',
  }),
  avatar: Joi.string().allow('').uri().messages({
    'string.uri': 'Avatar must be a valid URL.',
  }),
  theme: Joi.string().valid('light', 'dark', 'violet').messages({
    'any.only': 'Theme must be one of light, dark, or violet.',
  }),
  password: Joi.string().min(6).max(100).messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 6 characters.',
    'string.max': 'Password must be at most 100 characters.',
  }),
});
