import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRY = '7d';

export interface User {
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
  username: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(username: string): string {
  return jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): { username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser(username: string, password: string): Promise<AuthToken> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM login WHERE username = ?',
      [username]
    ) as any[];

    if (existingUsers.length > 0) {
      throw new Error('Username already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new user
    const [result] = await connection.execute(
      'INSERT INTO login (username, password) VALUES (?, ?)',
      [username, passwordHash]
    ) as any[];

    const userId = (result as any).insertId;

    // Generate token
    const token = generateToken(username);

    return { token, username };
  } finally {
    connection.release();
  }
}

/**
 * Login user
 */
export async function loginUser(username: string, password: string): Promise<AuthToken> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    // Find user by username
    const [users] = await connection.execute(
      'SELECT username, password FROM login WHERE username = ?',
      [username]
    ) as any[];

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];

    // Verify password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new Error('Incorrect password');
    }

    // Generate token
    const token = generateToken(user.username);

    return { token, username: user.username };
  } finally {
    connection.release();
  }
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.execute(
      'SELECT username, password FROM login WHERE username = ?',
      [username]
    ) as any[];

    if (users.length === 0) {
      return null;
    }

    return users[0];
  } finally {
    connection.release();
  }
}

/**
 * Update user usage (stub - can be extended if needed)
 */
export async function updateUserUsage(username: string, increment: boolean = true): Promise<{ usageCount: number; remainingUses: number }> {
  const FREE_TIER_DAILY_LIMIT = 3;
  
  // For now, return unlimited access for all users
  // This can be extended with additional columns in the login table if needed
  return { usageCount: 0, remainingUses: FREE_TIER_DAILY_LIMIT };
}
