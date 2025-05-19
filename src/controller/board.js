import createHttpError from 'http-errors';
import { boardCollection } from '../db/models/board.js';
import { userCollection } from '../db/models/user.js';

export const getBoardController = async (req, res) => {
  const { boardId } = req.params;
  const { _id: userId } = req.user;

  const result = await boardCollection.findById(boardId);

  if (!result) {
    throw createHttpError(404, 'Board not found');
  }

  if (result.user.toString() !== userId.toString()) {
    throw createHttpError(404, 'Board not found');
  }

  const { _id, title, icon, background, columns, updatedAt } = result;
  res.status(200).send({
    message: 'Board fetched successfully',
    status: '200',
    data: {
      _id,
      title,
      icon,
      background,
      updatedAt,
      columns,
    },
  });
};

export const createBoardController = async (req, res) => {
  const { _id: userId } = req.user;
  const { title } = req.body;

  // Check if board with same title exists for this user
  const existingBoard = await boardCollection.findOne({
    user: userId,
    title,
  });

  if (existingBoard) {
    throw createHttpError(409, `Board "${title}" already exists`);
  }

  const result = await boardCollection.create({ ...req.body, user: userId });

  if (!result) {
    throw createHttpError(400, 'Board creation failed');
  }

  // Add board reference to user
  await userCollection.findByIdAndUpdate(
    userId,
    {
      $push: { boards: result._id },
    },
    { new: true },
  );

  const {
    _id,
    title: boardTitle,
    icon,
    background,
    updatedAt,
    columns,
  } = result;
  res.status(201).send({
    message: 'Board created successfully',
    status: '201',
    data: {
      _id,
      title: boardTitle,
      icon,
      background,
      updatedAt,
      columns,
    },
  });
};

export const updateBoardController = async (req, res) => {
  const { _id: userId } = req.user;
  const { boardId } = req.params;
  const { title } = req.body;

  const board = await boardCollection.findById(boardId);

  if (!board) {
    throw createHttpError(404, 'Board not found');
  }

  if (board.user.toString() !== userId.toString()) {
    throw createHttpError(404, 'Board not found');
  }

  // Check if another board with same title exists
  if (title && title !== board.title) {
    const existingBoard = await boardCollection.findOne({
      user: userId,
      title,
    });

    if (existingBoard) {
      throw createHttpError(409, `Board "${title}" already exists`);
    }
  }

  const result = await boardCollection.findByIdAndUpdate(boardId, req.body, {
    new: true,
  });

  if (!result) {
    throw createHttpError(404, 'Board not found');
  }

  const { _id, title: boardTitle, icon, background, updatedAt } = result;
  res.status(200).send({
    message: 'Board updated successfully',
    status: '200',
    data: {
      _id,
      title: boardTitle,
      icon,
      background,
      updatedAt,
    },
  });
};

export const deleteBoardController = async (req, res) => {
  const { _id: userId } = req.user;
  const { boardId } = req.params;

  const board = await boardCollection.findById(boardId);

  if (!board) {
    throw createHttpError(404, 'Board not found');
  }

  if (board.user.toString() !== userId.toString()) {
    throw createHttpError(404, 'Board not found');
  }

  // Delete the board
  const result = await boardCollection.findByIdAndDelete(boardId);

  if (!result) {
    throw createHttpError(404, 'Board not found');
  }

  // Remove board reference from user
  await userCollection.findByIdAndUpdate(
    userId,
    {
      $pull: { boards: boardId },
    },
    { new: true },
  );

  res.status(200).send({
    message: 'Board deleted successfully',
    status: '200',
    data: {
      id: boardId,
      message: 'Board deleted',
    },
  });
};

export const updateBoardBackground = async (req, res) => {
  const { boardId } = req.params;
  const { _id: userId } = req.user;
  const { background } = req.body;

  if (!background || typeof background !== 'string') {
    throw createHttpError(400, 'Background must be a string');
  }

  const board = await boardCollection.findById(boardId);

  if (!board) {
    throw createHttpError(404, 'Board not found');
  }

  if (board.user.toString() !== userId.toString()) {
    throw createHttpError(403, 'User not authorized to update this board');
  }

  board.background = background;
  const updatedBoard = await board.save();

  res.status(200).send({
    message: 'Board background updated successfully',
    status: '200',
    data: {
      _id: updatedBoard._id,
      title: updatedBoard.title,
      icon: updatedBoard.icon,
      background: updatedBoard.background,
      updatedAt: updatedBoard.updatedAt,
    },
  });
};
