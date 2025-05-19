import { model, Schema } from 'mongoose';
import { iconTypes, backgroundTypes } from '../../constants/board.js';

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Set title for board'],
    },
    icon: {
      type: String,
      enum: iconTypes,
      default: 'icon-project',
    },
    background: {
      type: String,
      enum: backgroundTypes,
      default: '00',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: 'columns',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const boardCollection = model('boards', boardSchema);
