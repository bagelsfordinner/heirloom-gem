// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import { findUserByUsername, findUserByEmail, createUser } from '../models/userModel';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const passwordHash = await hashPassword(password);
    const newUser = await createUser(username, email, passwordHash);

    // Optionally generate a token on registration for immediate login
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordValid = await comparePasswords(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};