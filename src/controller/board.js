import createHttpError from 'http-errors';
import { boardCollection } from '../db/models/board.js';
import { userCollection } from '../db/models/user.js';
import { columnCollection } from '../db/models/column.js';

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

export const getBoardsController = async (req, res) => {
  const { _id: userId } = req.user;
  const boards = await boardCollection
    .find({ user: userId })
    .select('_id title icon background updatedAt');
  res.status(200).send({
    message: 'Boards fetched successfully',
    status: '200',
    data: boards,
  });
};

// add column to board

export const addColumnToBoardController = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;
  const { _id: userId } = req.user;

  if (!title || typeof title !== 'string') {
    throw createHttpError(400, 'Column title is required');
  }

  const board = await boardCollection.findById(boardId);

  if (!board) {
    throw createHttpError(404, 'Board not found');
  }

  if (board.user.toString() !== userId.toString()) {
    throw createHttpError(403, 'Not authorized to modify this board');
  }

  const newColumn = await columnCollection.create({
    title,
    board: boardId,
    tasks: [],
  });

  board.columns.push(newColumn._id);
  await board.save();

  res.status(201).send({
    message: 'Column added successfully',
    status: '201',
    data: {
      column: newColumn,
    },
  });
};

export const getColumnsController = async (req, res) => {
  const { boardId } = req.params;
  const { _id: userId } = req.user;

  const board = await boardCollection.findById(boardId);
  if (!board) {
    throw createHttpError(404, 'Board not found');
  }
  if (board.user.toString() !== userId.toString()) {
    throw createHttpError(403, 'Not authorized to view this board');
  }
  const columns = await columnCollection.find({ board: boardId });
  if (!columns) {
    throw createHttpError(404, 'Columns not found');
  }
  res.status(200).send({
    message: 'Columns fetched successfully',
    status: '200',
    data: {
      columns,
    },
  });
};

export const deleteColumnController = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { _id: userId } = req.user;

  const board = await boardCollection.findById(boardId);
  if (!board) {
    throw createHttpError(404, 'Board not found');
  }
  if (board.user.toString() !== userId.toString()) {
    throw createHttpError(403, 'Not authorized to delete this column');
  }

  const column = await columnCollection.findById(columnId);
  if (!column) {
    throw createHttpError(404, 'Column not found');
  }
  if (column.board.toString() !== boardId) {
    throw createHttpError(403, 'Not authorized to delete this column');
  }
  await columnCollection.findByIdAndDelete(columnId);
  board.columns = board.columns.filter((col) => col.toString() !== columnId);
  await board.save();
  res.status(200).send({
    message: 'Column deleted successfully',
    status: '200',
    data: {
      columnId,
    },
  });
};

export const updateColumnController = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { _id: userId } = req.user;
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    throw createHttpError(400, 'Column title is required');
  }

  const board = await boardCollection.findById(boardId);
  if (!board) {
    throw createHttpError(404, 'Board not found');
  }
  if (board.user.toString() !== userId.toString()) {
    throw createHttpError(403, 'Not authorized to update this column');
  }

  const column = await columnCollection.findById(columnId);
  if (!column) {
    throw createHttpError(404, 'Column not found');
  }
  if (column.board.toString() !== boardId) {
    throw createHttpError(403, 'Not authorized to update this column');
  }
  column.title = title;
  await column.save();
  res.status(200).send({
    message: 'Column updated successfully',
    status: '200',
    data: {
      column,
    },
  });
};
