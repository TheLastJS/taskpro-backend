import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title for column'],
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tasks',
      },
    ],
    board: {
      type: Schema.Types.ObjectId,
      ref: 'boards',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const columnCollection = model('columns', columnSchema);
