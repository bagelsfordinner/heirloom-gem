// backend/src/utils/auth.ts
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken'; // Ensure these are imported

const SALT_ROUNDS = 10;

// JWT_SECRET is handled correctly now.
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
if (JWT_SECRET === 'fallback_secret_for_dev_only' && process.env.NODE_ENV !== 'production') {
    console.warn('WARNING: JWT_SECRET is using a fallback. Set it in your .env.local for production.');
}

// Get the expiration string from environment variables
const JWT_EXPIRATION_STRING: string = process.env.JWT_EXPIRATION || '1h';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  // Use a type assertion here for `expiresIn`
  const options: SignOptions = {
    expiresIn: JWT_EXPIRATION_STRING as SignOptions['expiresIn'], // <--- THE KEY CHANGE IS HERE
  };

  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    options
  );
};

export const verifyToken = (token: string): { id: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};