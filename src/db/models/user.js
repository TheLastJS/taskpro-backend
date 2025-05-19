import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'violet'],
      default: 'light',
    },
    boards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'boards',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const userCollection = model('users', usersSchema);
