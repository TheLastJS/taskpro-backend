/* eslint-disable no-undef */
import createHttpError from 'http-errors';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/users.js';

//GET ALL USERS
export const getUsersController = async (req, res) => {
  const users = await getAllUsers();

  if (!users) {
    throw createHttpError(404, 'No users found');
  }
  res.status(200).send({
    message: 'Users fetched successfully',
    status: '200',
    data: users,
  });
};

//GET USER BY ID
export const getUserByIdController = async (req, res) => {
  const { userId } = req.params;
  const user = await getUserById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  res.status(200).send({
    message: 'User fetched successfully',
    status: '200',
    data: user,
  });
};

//CREATE USER
export const createUserController = async (req, res) => {
  const { name, email, password, avatar, theme } = req.body;
  const newUser = await createUser({ name, email, password, avatar, theme });

  if (!newUser) {
    throw createHttpError(400, 'User creation failed');
  }
  res.status(201).send({
    message: 'User created successfully',
    status: '201',
    data: newUser,
  });
};
//UPDATE USER
export const updatePatchUserController = async (req, res) => {
  const { userId } = req.params;
  const { name, avatar, theme } = req.body;
  const updatedUser = await updateUser(userId, { name, avatar, theme });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }
  res.status(200).send({
    message: 'User updated successfully',
    status: '200',
    data: updatedUser,
  });
};
//DELETE USER
export const deleteUserController = async (req, res) => {
  const { userId } = req.params;
  const deletedUser = await deleteUser(userId);

  if (!deletedUser) {
    throw createHttpError(404, 'User not found');
  }
  res.status(200).send({
    message: 'User deleted successfully',
    status: '200',
    data: deletedUser,
  });
};
