import createHttpError from 'http-errors';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUser,
} from '../services/users.js';
import { saveFileToCloudinary } from '../utils/createFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

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
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
  const { name, email, password, theme } = req.body;
  const avatarFile = req.file;
  let avatarUrl = req.body.avatar || null;

  if (avatarFile) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      avatarUrl = await saveFileToCloudinary(avatarFile);
    } else {
      avatarUrl = await saveFileToUploadDir(avatarFile);
    }
  }

  const newUser = await createUser({
    name,
    email,
    password,
    avatar: avatarUrl,
    theme,
  });

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
  let { name, avatar, theme, password } = req.body;
  let avatarUrl = avatar;
  if (avatarUrl === '') avatarUrl = null;

  // Eğer dosya geldiyse kaydet
  if (req.file) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      avatarUrl = await saveFileToCloudinary(req.file);
    } else {
      avatarUrl = await saveFileToUploadDir(req.file);
    }
  }

  const updatedUser = await updateUser(userId, { name, avatar: avatarUrl, theme, password });

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
// GET CURRENT USER
export const getCurrentUserController = async (req, res) => {
  console.log('getCurrentUserController çalıştı');
  console.log('req.user:', req.user);
  if (!req.user) {
    throw createHttpError(400, 'req.user yok');
  }
  const userId = req.user._id?.toString();
  if (!userId) {
    throw createHttpError(400, 'userId yok');
  }
  const user = await getCurrentUser(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).send({
    message: 'Current user fetched successfully',
    status: '200',
    data: user,
  });
};
