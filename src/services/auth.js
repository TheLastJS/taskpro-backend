import createHttpError from 'http-errors';
import { userCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../constants/index.js';
import { SessionsCollection } from '../db/models/sessions.js';

// Generate JWT tokens
const generateTokens = (user) => {
  const payload = { id: user._id, email: user.email };
  const accessToken = jwt.sign(payload, env('JWT_SECRET'), {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, env('JWT_SECRET'), {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika
  const refreshTokenValidUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

// Register a new user
export const registerUser = async (userData) => {
  const { email, password } = userData;
  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userCollection.create({
    ...userData,
    password: hashedPassword,
  });
  return { id: user._id, name: user.name, email: user.email };
};

// Login user and return JWT tokens
export const loginUser = async ({ email, password }) => {
  const user = await userCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Invalid password');
  const tokens = generateTokens(user);

  // Delete Old Sessions
  await SessionsCollection.deleteMany({ userId: user._id });

  // New Session
  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenValidUntil: tokens.accessTokenValidUntil,
    refreshTokenValidUntil: tokens.refreshTokenValidUntil,
  });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenValidUntil: tokens.accessTokenValidUntil,
    refreshTokenValidUntil: tokens.refreshTokenValidUntil,
    sessionId: session._id,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      theme: user.theme
    }
  };
};

// Refresh JWT tokens
export const refreshUser = async (refreshToken) => {
  try {
    const session = await SessionsCollection.findOne({ refreshToken });
    if (!session || session.refreshTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }
    const decoded = jwt.verify(refreshToken, env('JWT_SECRET'));
    const user = await userCollection.findById(decoded.id);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    const tokens = generateTokens(user);

    // Update Session
    session.accessToken = tokens.accessToken;
    session.refreshToken = tokens.refreshToken;
    session.accessTokenValidUntil = tokens.accessTokenValidUntil;
    session.refreshTokenValidUntil = tokens.refreshTokenValidUntil;
    await session.save();

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenValidUntil: tokens.accessTokenValidUntil,
      refreshTokenValidUntil: tokens.refreshTokenValidUntil,
      sessionId: session._id,
    };
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }
};

// Logout user
export const logoutUser = async (sessionId) => {
  await SessionsCollection.findByIdAndDelete(sessionId);
  return { message: 'User logged out successfully' };
};
