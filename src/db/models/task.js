import { model, Schema } from 'mongoose';

const priorityTypes = ['Without', 'Low', 'Medium', 'High'];

const taskSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: priorityTypes,
      default: 'Without',
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    column: {
      type: Schema.Types.ObjectId,
      ref: 'columns',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

export const taskCollection = model('tasks', taskSchema);

export { priorityTypes };
