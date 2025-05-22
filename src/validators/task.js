import Joi from 'joi';
import { priorityTypes } from '../db/models/task.js';

const addTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  priority: Joi.string().valid(...priorityTypes),
  deadline: Joi.date(),
  // column: Joi.string().required(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  priority: Joi.string().valid(...priorityTypes),
  deadline: Joi.date(),
  column: Joi.string(),
});

const replaceTaskSchema = Joi.object({
  column: Joi.string().required().messages({
    'any.required': 'missing required column field',
  }),
});

export { addTaskSchema, updateTaskSchema, replaceTaskSchema };
