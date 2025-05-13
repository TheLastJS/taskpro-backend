import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_CLIENT_ID'),
  clientSecret: env('GOOGLE_CLIENT_SECRET'),
  redirectUri: env('GOOGLE_REDIRECT_URL'),
});

export const generateGoogleAuthUrl = () => {
  return googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
};

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens) {
    throw new Error('Invalid code');
  }
  const idToken = response.tokens.id_token;
  const ticket = await googleOAuthClient.verifyIdToken({
    idToken,
  });
  const payload = ticket.getPayload();

  const name = `${payload.given_name} ${payload.family_name}`;
  const email = payload.email;

  return {
    name,
    email,
  };
};
