import { userCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';

//GET ALL USERS
export const getAllUsers = async () => {
  const users = await userCollection.find();
  return users;
};
//GET USER BY ID
export const getUserById = async (userId) => {
  const user = await userCollection.findById(userId);
  return user;
};
//CREATE USER
export const createUser = async ({ name, email, password, avatar, theme }) => {
  const newUser = await userCollection.create({
    name,
    email,
    password,
    avatar,
    theme,
  });
  return newUser;
};
//UPDATE USER
export const updateUser = async (userId, { name, avatar, theme, password }) => {
  const updateFields = { name, avatar, theme };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateFields.password = hashedPassword;
  }
  const updatedUser = await userCollection.findByIdAndUpdate(
    userId,
    updateFields,
    { new: true },
  );
  return updatedUser;
};
//DELETE USER
export const deleteUser = async (userId) => {
  const deletedUser = await userCollection.findByIdAndDelete(userId);
  return deletedUser;
};

// GET CURRENT USER
export const getCurrentUser = async (userId) => {
  console.log('getCurrentUser fonksiyonu çağrıldı, userId:', userId);
  const currentUser = await userCollection.findById(userId).select('-password');
  return currentUser;
};
