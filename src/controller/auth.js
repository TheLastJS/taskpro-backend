import {
  loginUser,
  logoutUser,
  registerUser,
  refreshUser,
} from '../services/auth.js';
import { generateGoogleAuthUrl } from '../utils/googleOAuth.js';

export const registerUserController = async (req, res) => {
  const userData = req.body;
  const newUser = await registerUser(userData);
  res.status(201).send({
    message: 'User registered successfully',
    status: 201,
    user: newUser,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.sessionId, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    message: 'User logged in successfully and session created',
    status: 200,
    data: {
      accessToken: session.accessToken,
      accessTokenValidUntil: session.accessTokenValidUntil,
      user: session.user
    },
  });
};

export const refreshUserController = async (req, res) => {
  const { refreshToken } = req.cookies;
  const session = await refreshUser(refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.sessionId, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    message: 'Token refreshed successfully',
    status: 200,
    data: {
      accessToken: session.accessToken,
      accessTokenValidUntil: session.accessTokenValidUntil,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;
  await logoutUser(sessionId);

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(200).send({
    message: 'User logged out successfully',
    status: 200,
  });
};

export const getGoogleAuthUrlController = async (req, res) => {
  const url = await generateGoogleAuthUrl();

  return res.status(200).send({
    message: 'Google auth url generated successfully',
    status: 200,
    data: {
      url,
    },
  });
};
