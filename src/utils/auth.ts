// src/utils/auth.ts (Frontend utility for basic client-side token info)
import { JwtPayload, decode } from 'jsonwebtoken';

// Basic client-side JWT decoder for getting user ID from token
export const verifyToken = (token: string): { id: string } | null => {
  try {
    const decoded = decode(token) as JwtPayload; // Decode the token (does NOT verify signature)
    if (decoded && decoded.id) {
      return { id: decoded.id as string };
    }
    return null;
  } catch (error) {
    console.error('Client-side token decode failed:', error);
    return null;
  }
};